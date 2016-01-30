#!/usr/bin/python3
import os
from apiclient import discovery
from googleapiclient import errors
import httplib2
from oauth2client.client import SignedJwtAssertionCredentials
from apiclient import http

import json

SCOPES = 'https://www.googleapis.com/auth/drive.readonly'
SERVICE_ACCOUNT_CRED_FILE = ".credentials/m3-GA2016-8a60840cfaba.json"

with open(SERVICE_ACCOUNT_CRED_FILE) as f:
    data = json.loads(f.read())
    private_key = data['private_key']
    client_email = data['client_email']

credentials = SignedJwtAssertionCredentials(client_email, private_key, SCOPES)

service = discovery.build('drive', 'v3', http=(credentials.authorize(httplib2.Http())))


class DriveObject(object):
    @staticmethod
    def create(id, mime_type):
        if mime_type == "application/vnd.google-apps.folder":
            return Folder(id)
        if mime_type == "application/vnd.google-apps.document":
            return File(id)
        else:
            return DriveObject(id)

    def __init__(self, id):
        self.id = id
        self._properties = None

    def download_to(self, path):
        resource = service.files().get_media(fileId=self.id)
        file = open(path+self.properties['name'], "wb")
        media_request = http.MediaIoBaseDownload(file, resource)
        try:
            done = False
            while not done:
                download_progress, done = media_request.next_chunk()
        except errors.HttpError as error:
            print('An error occurred: %s' % error)

    @property
    def properties(self):
        if self._properties is None:
            self._properties = service.files().get(fileId=self.id).execute()
        return self._properties


class File(DriveObject):
    def __init__(self, id):
        super().__init__(id)
        self._data = None

    @property
    def content(self):
        if not self._data:
            self._data = service.files().export_media(fileId=self.id, mimeType='application/pdf').execute()
        return self._data

    def download_to(self, path):
        with open(path+self.properties['name']+".pdf", "wb") as target_file:
            target_file.write(self.content)


class Folder(DriveObject):
    def __init__(self, id):
        super().__init__(id)
        self._children = None

    def download_to(self, path):
        folder_path = path + self.properties['name'] + "/"
        os.mkdir(folder_path)
        for child in self.children:
            child.download_to(folder_path)

    @property
    def children(self):
        collect = []
        if self._children is None:
            next_page_token = None
            while True:
                #prepare args
                kwargs = dict()
                kwargs['fields'] = "nextPageToken, files(id, name, mimeType)"
                kwargs['q'] = "'{0}' in parents".format(self.id)
                if next_page_token:
                    kwargs['pageToken'] = next_page_token

                #get page of files
                response = service.files().list(**kwargs).execute()

                # yield every file
                for file_obj in response['files']:
                    drive_object = DriveObject.create(file_obj['id'], file_obj['mimeType'])
                    collect.append(drive_object)
                    yield drive_object
                # update args to get next page or break
                if 'nextPageToken' in response:
                    next_page_token = response['nextPageToken']
                else:
                    break

            # save list
            self._children = collect
        else:
            for drive_object in self._children:
                yield drive_object
