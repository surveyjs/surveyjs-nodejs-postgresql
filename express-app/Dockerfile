# syntax=docker/dockerfile:1.4
FROM node:lts AS development

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

WORKDIR /code

ARG PORT=3000
ENV PORT $PORT
EXPOSE $PORT

COPY ./package.json /code/package.json
# RUN npm i
COPY ../package-lock.json /code/package-lock.json
RUN npm ci

CMD [ "node", "express-app/index.js" ]

FROM development as dev-envs
RUN <<EOF
apt-get update
apt-get install -y --no-install-recommends git
EOF

RUN <<EOF
useradd -s /bin/bash -m vscode
groupadd docker
usermod -aG docker vscode
EOF
# install Docker tools (cli, buildx, compose)
COPY --from=gloursdocker/docker / /
