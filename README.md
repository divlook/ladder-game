# README

## Summary

단순한 사다리 게임입니다.

## Install

- [NodeJs](https://nodejs.org/)

    NodeJs version 12에서 개발되었습니다. 최대한 LTS 버전을 사용하는게 좋으며, 최소 10 이상 사용하셔야됩니다.

- [PM2](https://pm2.keymetrics.io/)

    배포시 필요한 프로그램입니다.

## npm run [command]

### dev

개발환경을 실행할 때 사용합니다. (http://localhost:3000)

### build

build 디렉토리에 컴파일된 소스를 생성합니다.

### start

컴파일된 소스로 서버를 실행합니다. (http://0.0.0.0:3000)

### type-check, lint

문법검사시 사용하는 명령입니다. `dev`, `build` 명령 실행시 자동으로 실행됩니다.

### deploy [setup]

pm2를 사용하여 배포시 사용합니다. 배포관련 설정이 미리 필요하며, [Deploy config](#deploy-config)을 확인해주세요.

## Deploy config

배포를 위한 설정은 [deploy.env](./deploy.env)에서 할 수 있지만 직접 수정하시면 안됩니다. [deploy.env](./deploy.env) 파일을 복사하여 같은 경로에 `deploy.env.local` 파일을 만들어주세요. `deploy.env.local`은 git이 추적하지 않습니다.

### deploy.env.local 생성

```bash
cp deploy.env deploy.env.local
```

### deploy.env property

| name | description | example |
| - | - | - |
| LADDER_DEPLOY_SSH_KEY | 원격연결에 사용할 ssh key | |
| LADDER_DEPLOY_USER | 원격연결에 사용할 username | |
| LADDER_DEPLOY_HOST | host | |
| LADDER_DEPLOY_PATH | 배포할 서버상 경로 (반드시 절대경로로 입력) | /var/www/ladder-game |
| LADDER_DEPLOY_BRANCH | 서버에서 pull 받을 git의 branch | origin/master |
| LADDER_DEPLOY_REPO | 서버에서 pull 받을 git 주소 | git@github.com:divlook/ladder-game.git |

### 첫번째 배포

첫 배포시 서버에 파일을 생성하기 위해 아래의 명령을 실행해야 합니다.

```bash
npm run deploy setup
```

## Tech stack

- [NextJs](https://nextjs.org/) : v9.2
- [Material-UI](https://material-ui.com/) : v4.9
- [TypeScript](https://www.typescriptlang.org/) : v3.7
