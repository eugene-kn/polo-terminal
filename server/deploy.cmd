@echo off

echo Setting up environment...
set GOPATH=D:\Development\Workspace\Go;D:\Development\Lab\polo-terminal\server
set GOOS=linux
set GOARCH=amd64

echo Building binary...
go build -o bin\cors-proxy src\cors-proxy.go

echo Building image...
docker build -t mastervip/private:cors-proxy .

echo Pushing image...
docker push mastervip/private:cors-proxy

echo Done.