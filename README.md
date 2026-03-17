# AI Sticker (DALL·E) Example

사용자가 단어/문장을 입력하면 **OpenAI 이미지 생성 API(DALL·E 계열)**로 스티커 이미지를 만들고 화면에 보여주는 예제예요.

이 예제는 **앱(토스 미니앱) + 서버(OpenAI 호출)**로 구성돼요.
OpenAI API 키가 앱에 포함되면 누구나 키를 빼낼 수 있어서, **서버가 OpenAI를 대신 호출**하고 앱은 서버만 호출하도록 만들었어요.

<br />

## 🧩 폴더 구조

- `app/`: 토스 미니앱(React Native + Granite)
- `server/`: 로컬 서버(Express) — OpenAI API 호출 담당

<br />

## ✅ 준비물

1. PC에 **Node.js** 설치
2. 휴대폰에 **토스 앱 또는 샌드박스 앱** 설치
3. OpenAI API 키(서버에서만 사용)
4. (필요한 경우) `toss-design-system` npm 접근 토큰

<br />

## 🚀 설치 및 실행 방법 (Windows / PowerShell)

### 1) 서버 실행 (OpenAI 호출용)

1. 서버 폴더로 이동

```
cd server
```

2. 환경 변수 파일 만들기

`server/.env.server` 파일을 만들고 아래처럼 채워주세요.

```bash
OPENAI_API_KEY=여기에_본인_OpenAI_API_키
OPENAI_IMAGE_MODEL=gpt-image-1
PORT=4000
```

3. 패키지 설치

```
yarn install
```

4. 서버 실행

```
yarn dev
```

서버가 켜지면 `http://localhost:4000/health`가 OK를 반환해요.

<br />

### 2) 앱 실행 (토스 미니앱)

1. 앱 폴더로 이동

```
cd ..\app
```

2. (필요한 경우) 토큰 설정

`app/.yarnrc.yml`에서 `npmAuthToken`에 토큰을 넣어주세요.

3. 패키지 설치

```
yarn install
```

4. 개발 서버 실행

```
yarn dev
```

5. 휴대폰에서 테스트

토스(또는 샌드박스)에서 개발자/테스트 방식으로 접속한 뒤, 실행 중인 미니앱을 열어주세요.

