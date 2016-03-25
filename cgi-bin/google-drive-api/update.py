#!/usr/bin/python3
import cgitb
import shutil

cgitb.enable()
from gDrive import *
import sys
import glob
import os
import os

# ID of the folder to download
PUBLIC_ROOT_FOLDER = "0Bw2tg9yYV6_JR3pQYnVJanRveWc"
# Local path to download the folder into
LOCAL_COPY_ROOT_PATH = "cache/"

print("Content type: text/plain\n")
print("Downloading everything from google drive, please stand by\n"); sys.stdout.flush()
print("Running as {0}".format(os.getegid()))

# Remove folder contents if already exist
for file_path in glob.glob(LOCAL_COPY_ROOT_PATH+"*"):
    print(file_path)
    print(os.path.isfile(file_path))
    if os.path.isfile(file_path):
        os.remove(file_path)
    else:
        shutil.rmtree(file_path)
# Download all files/subfolders
for child in Folder(PUBLIC_ROOT_FOLDER).children:
    child.download_to(LOCAL_COPY_ROOT_PATH)

print("Updated local copy successfully")
