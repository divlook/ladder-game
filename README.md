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

pm2를 사용하여 배포시 사용합니다. 배포관련 설정이 필요하며, [Deploy](#deploy)을 확인해주세요.

## Config

환경변수와 관련된 설정파일은 모두 [configs](./configs) 경로에 있습니다.

기본 설정파일이 `[name].env.example` 형태로 존재하고 있으며, 파일명에서 `.example`을 삭제한 뒤 같은 경로에 복사하여 사용할 수 있습니다.

```diff
  configs/
  ┣ [name].env.example
+ ┗ [name].env
```

### local 설정파일

파일명 뒤에 `.local`을 붙여서 local에서만 사용할 수 있는 설정파일을 만들 수 있습니다.

```diff
  configs/
+ ┗ [name].env.local
```

### 환경변수별 설정파일

NodeJs의 환경변수인 `NODE_ENV`에 따라서 다른 설정파일을 사용할 수 있습니다. `NODE_ENV`는 production, test, development 이렇게 3개만 사용할 수 있습니다.

```diff
  configs/
+ ┗ [name].env.production
```

### 설정파일 우선 순위

환경변수는 설정파일의 우선 순위에 따라서 적용되거나 삭제될 수 있습니다.

1. `[name].env.[NODE_ENV].local`
2. `[name].env.[NODE_ENV]`
3. `[name].env.local`
4. `[name].env`

## Deploy

배포를 위한 설정은 [deploy.env](./configs/deploy.env.example) 파일을 참고하세요.

### deploy.env 생성

```bash
cp configs/deploy.env.example configs/deploy.env
```

### Deploy Config Property

- deploy.env

    | name | description | example |
    | - | - | - |
    | LADDER_DEPLOY_SSH_KEY | 원격연결에 사용할 ssh key | |
    | LADDER_DEPLOY_USER | 원격연결에 사용할 username | |
    | LADDER_DEPLOY_HOST | host | |
    | LADDER_DEPLOY_PATH | 배포할 서버상 경로 (반드시 절대경로로 입력) | /var/www/ladder-game |
    | LADDER_DEPLOY_REMOTE | git remote name | origin |
    | LADDER_DEPLOY_BRANCH | git branch name | master |
    | LADDER_DEPLOY_REPO | 서버에서 pull 받을 build용 git 주소 | git@github.com:divlook/ladder-game-build.git |

### 첫번째 배포

첫 배포시 서버에 파일을 생성하기 위해 아래의 명령을 실행해야 합니다.

```bash
npm run deploy setup
```

## Tech stack

- [NextJs](https://nextjs.org/) : v9.2
- [Material-UI](https://material-ui.com/) : v4.9
- [TypeScript](https://www.typescriptlang.org/) : v3.7
