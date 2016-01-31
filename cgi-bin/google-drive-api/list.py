#!/usr/bin/python3
import cgitb
import json
import os

DIR = "cache/"
cgitb.enable()


class Folder():
    def __init__(self, name, folders, files):
        self.name = name
        self.folders = folders
        self.files = files

    def get_json(self):
        return {
            "folders": {k: v.get_json() for k, v in self.folders.items()},
            "files": {k: v.get_json() for k, v in self.files.items()}
        }

    @property
    def filename(self):
        return self.name


class File():
    def __init__(self, name, type, size):
        self.name = name
        self.type = type
        self.size = size

    def get_json(self):
        return {"name": self.name, "type": self.type, "size": self.size}

    @property
    def filename(self):
        return self.name+"."+self.type


def split_file_extension(filename):
    parts = filename.split(".")
    return ".".join(parts[0:-1]), parts[-1]


def parseDir(name, dir):
    subs = os.listdir(dir)
    folders = {}
    files = {}
    for sub in subs:
        subdir = dir + sub + "/"
        if os.path.isdir(subdir):
            folders[sub] = parseDir(sub, subdir)
        else:
            name, ext = split_file_extension(sub)
            size = os.path.getsize(dir + sub)
            files[sub] = File(name, ext, size)
    return Folder(name, folders, files)

print("Content-type: application/json\n")
parsed_folder = parseDir("cache", "cache/")
print(json.dumps(parsed_folder.get_json()))