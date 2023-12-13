@echo off
for %%i in (*.ogg) do (
    ffmpeg -i "%%i" -c:a libmp3lame -q:a 2 "%%~ni.mp3"
)