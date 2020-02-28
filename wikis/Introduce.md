[demo]: https://ladder.divlook.dev/
[github]: https://github.com/divlook/ladder-game

# Ladder Game

## 목차

- 소개
- 기술 스택
- 파일 구조

## 소개

[Ladder Game][github]은 웹사이트에서 간단하게 사다리 게임을 하기 위해 만든 토이 프로젝트입니다. 아직 완성되지는 않았지만 1차적으로 구현하려고 했던 기능들이 완료되어 소스를 공개합니다.

[Demo][demo] 이 링크를 클릭하여 지금 바로 사다리 게임을 할 수 있습니다. 데스크탑 웹과 모바일 웹을 모두 지원하지만, Internet Explorer(이하 IE)는 버전 11이상만 호환됩니다. IE 버전 10이하는 사용하는데 문제가 있을 수 있으니 최신 브라우저를 사용해주세요.

## 기술 스택

### 메인 프레임워크

- [NextJs](https://nextjs.org/)

  사실 NextJs는 이 프로젝트와는 어울리는 프레임워크가 아닙니다. 토이 프로젝트는 자신이 달성하고 싶은 목표를 정하고 그것을 해보는게 중요하다고 생각하는데 이번에 React Hook API 사용, SSR 구현, 빌드와 배포의 자동화, 안정적인 서버 운영등의 목표를 달성하는데 가장 적합하다고 판단하여 선택하였습니다.

### UI 관련

- [Material-UI](https://material-ui.com/)

  디자인적인 부분은 배제하고 기능 구현에 집중하기 위해 사용했습니다.

### 개발 관련

- [TypeScript](https://www.typescriptlang.org/)

  사다리게임은 구지 만들어보지 않아도 데이터 구조가 복잡할 것으로 예상됩니다. 타입스크립트를 사용하면 타입의 힌트를 얻을 수 있기때문에 사용하지 않을 이유가 없습니다.

- [Eslint](https://eslint.org/)

  Eslint를 사용하면 오타를 제외한 잘못된 코드를 미리 발견할 수 있습니다. 에디터에 있는 플로그인으로도 사용할 수 있지만 에디터 플러그인은 에디터에 종속되기때문에 좋은 방법이 아니라고 생각합니다. Webpack loader에 추가해놓으면 빌드할 때마다 검사하기 때문에 대부분의 오류를 미리 방지할 수 있습니다.

- [Prettier](https://prettier.io/)

  일관적인 코드 스타일을 유지하기위해 사용합니다. Prettier도 에디터 플러그인으로 사용할 수 있지만 Eslint와 같은 이유로 Eslint 플로그인으로 추가하여 강제로 지키도록 하였습니다.

- [PM2](https://pm2.keymetrics.io/)

  PM2는 NodeJs로 만들어진 daemon process manager입니다. PM2를 사용하면 NodeJs 서버를 데몬으로 실행하고 관리할 수 있습니다. 플러그인을 추가하면 원격기능과 배포기능도 있어서 매우 유용합니다.

## 파일 구조

```
ladder-game/
┃
┣ .next/
┃ ┃
┃ ┗ Dev Server에서 사용하는 빌드 폴더
┃
┣ build/
┃ ┃
┃ ┗ 상용 빌드 폴더
┃
┣ @types/
┃ ┃
┃ ┗ TypeScript Declaration Files
┃
┣ configs/
┃ ┃
┃ ┣ deploy/
┃ ┃ ┃
┃ ┃ ┗ 서버정보가 있는 .env 파일들
┃ ┃
┃ ┗ plugin.env
┃
┣ cypress/
┃ ┃
┃ ┗ Cypress Files
┃
┣ dist/
┃ ┃
┃ ┗ 서버를 사용하지 않는 정적파일들
┃
┣ node_modules/
┃ ┃
┃ ┗ Node Modules
┃
┣ lib/
┃ ┃
┃ ┗ 공용으로 사용하는 함수 파일들
┃
┣ components/
┃ ┃
┃ ┗ React Component Files
┃
┣ hooks/
┃ ┃
┃ ┗ React Custom Hooks
┃
┣ layouts/
┃ ┃
┃ ┗ React Layouts
┃
┣ pages/
┃ ┃
┃ ┗ React Pages
┃
┣ reducers/
┃ ┃
┃ ┗ React Reducers
┃
┣ plugins/
┃ ┃
┃ ┗ 외부 라이브러리 사용시 여기에 추가해서 사용
┃
┗ scripts/
  ┃
  ┗ Node 또는 Shell scripts
```
