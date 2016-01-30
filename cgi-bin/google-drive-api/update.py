#!/usr/bin/python3
import cgitb
import shutil

cgitb.enable()
import cgi
from gDrive import *

# ID of the folder to download
PUBLIC_ROOT_FOLDER = "0Bw2tg9yYV6_JaktWYnpXWlhJSGs"
# Local path to download the folder into
LOCAL_COPY_ROOT_PATH = "cache/"

print("Content type: text/plain\n")

# Remove folder with contents if already exists
shutil.rmtree(LOCAL_COPY_ROOT_PATH, ignore_errors=True)
os.mkdir(LOCAL_COPY_ROOT_PATH)
# Download all files/subfolders
for child in Folder(PUBLIC_ROOT_FOLDER).children:
    child.download_to(LOCAL_COPY_ROOT_PATH)

print("Updated local copy successfully")
