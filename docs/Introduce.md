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

## 구조

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
