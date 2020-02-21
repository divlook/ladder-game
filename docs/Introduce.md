# 프로젝트 소개

단순한 사다리 게임입니다.


# 구조

```
ladder-game/
┣ .next/
┃ ┗ ...Dev Server에서 사용하는 빌드 폴더
┣ build/
┃ ┗ ...상용 빌드 폴더
┣ @types/
┃ ┗ ...TypeScript Declaration Files
┣ configs/
┃ ┣ deploy/
┃ ┃ ┗ ...서버정보가 있는 .env 파일들
┃ ┗ plugin.env
┣ cypress/
┃ ┗ ...Cypress Files
┣ dist/
┃ ┗ ...서버를 사용하지 않는 정적파일들
┣ node_modules/
┃ ┗ ...Node Modules
┣ lib/
┃ ┗ ...공용으로 사용하는 함수 파일들
┣ components/
┃ ┗ ...React Component Files
┣ hooks/
┃ ┗ ...React Custom Hooks
┣ layouts/
┃ ┗ ...React Layouts
┣ pages/
┃ ┗ ...React Pages
┣ reducers/
┃ ┗ ...React Reducers
┣ plugins/
┃ ┗ ...외부 라이브러리 사용시 여기에 추가해서 사용
┗ scripts/
  ┗ ...Node 또는 Shell scripts
```
