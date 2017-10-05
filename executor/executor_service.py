import os
import uuid
import docker
import shutil

from docker.errors import APIError
from docker.errors import ImageNotFound
from docker.errors import ContainerError

IMAGE_NAME = 'cqzxlong/coj-executor'
CONTAINER_NAME = '%s:latest' % IMAGE_NAME
client = docker.from_env()

CURRENT_DIR = os.path.dirname(os.path.relpath(__file__))
TMP_FILES_DIR = '%s/tmp' % CURRENT_DIR


SOURCE_FILE_NAMES = {
    'java': 'Solution.java',
    'python': 'solution.py',
    'javascript': 'solution.js'
}
BINARY_FILE_NAMES = {
    'java': 'Solution',
    'python': 'solution.py',
    'javascript': 'solution.js'
}
COMPILE_COMMANDS = {
    'java': 'javac',
    'python': 'python',
    'javascript': 'nodejs'
}
EXECUTE_COMMANDS = {
    'java': 'java',
    'python': 'python',
    'javascript': 'nodejs'
}

def load_image():
    try:
        client.images.get(IMAGE_NAME)
        print 'Image loaded locally'
    except IMAGENotFound:
        client.images.pull(IMAGE_NAME)
        print 'Image loaded from remote repository'
    except APIError:
        print 'Image not found locally or remotely. Program exit'
        return
    print 'Image loaded'

def mk_dir(dir):
    try:
        os.mkdir(dir)
        print 'Dir made successfully'
    except OSError:
        print 'Dir made fail'

def build_and_run(language, code):
    result = {'build': 'N/A', 'run': 'N/A'}
    user_dir = uuid.uuid4()
    host_source_file_dir = '%s/%s' % (TMP_FILES_DIR, user_dir)
    guest_source_file_dir = '/test/%s' % user_dir
    mk_dir(host_source_file_dir)

    with open('%s/%s' % (host_source_file_dir, SOURCE_FILE_NAMES[language]), 'w') as source_file:
        source_file.write(code)

    # build source file to executable file
    try:
        client.containers.run(
            image=IMAGE_NAME,
            command='%s %s' % (COMPILE_COMMANDS[language], SOURCE_FILE_NAMES[language]),
            volumes={host_source_file_dir: {'bind': guest_source_file_dir, 'mode': 'rw'}},
            working_dir=guest_source_file_dir
        )
        print 'Build successfully'
        result['build'] = 'OK'
    except ContainerError as e:
        print 'Build fail'
        result['build'] = e.stderr
        shutil.rmtree(host_source_file_dir)
        return result

    # run executable file
    try:
        log = client.containers.run(
            image=IMAGE_NAME,
            command='%s %s' % (EXECUTE_COMMANDS[language], BINARY_FILE_NAMES[language]),
            volumes={host_source_file_dir: {'bind': guest_source_file_dir, 'mode': 'rw'}},
            working_dir=guest_source_file_dir
        )
        result['run'] = log
        print 'Run successfully'
    except ContainerError as e:
        result['run'] = e.stderr
        print 'Run fail'
        shutil.rmtree(host_source_file_dir)
        return result

    shutil.rmtree(host_source_file_dir)

    return result