# Omnivore to Notion

Omnivore에 저장된 아티클들을 Notion 데이터베이스로 옮기는 도구입니다.

## 설정 방법

### 1. Notion API 키 발급

1. [Notion Developers](https://www.notion.so/my-integrations) 페이지 방문
2. "새 API 통합" 버튼 클릭
3. "API 통합 이름" 입력 (예: "Omnivore Sync")
4. "관련된 워크스페이스" 및 "유형" 선택
5. "저장" 버튼 클릭
6. 생성된 "프라이빗 API 통합 시크릿"을 복사하여 저장 (API 키)

### 2. Notion 데이터베이스 생성 및 ID 확인

1. Notion에서 새 페이지 생성
2. `/database` 를 입력하고 "Table - Full page" 선택
3. 다음 속성들을 추가:
   - Title (기본으로 존재)
   - URL (URL 타입)
   - SavedAt (Date 타입)
   - Labels (Multi-select 타입)

4. 데이터베이스 ID 확인 방법:
   - 데이터베이스 페이지를 열고 URL 확인
   - URL 형식: `https://www.notion.so/workspace/{DATABASE_ID}?v=...`
   - `workspace/` 다음에 오는 32자리 문자열이 데이터베이스 ID

### 3. Notion 통합 연결

1. 생성한 데이터베이스 페이지에서 우측 상단의 ... 메뉴 클릭
2. "연결 항목" 선택
3. 이전에 생성한 integration을 찾아 연결

### 4. 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 입력:

```
NOTION_API_KEY=your_notion_api_key
NOTION_DATABASE_ID=your_database_id
OMNIVORE_API_KEY=your_omnivore_api_key
```

## 사용 방법

1. 의존성 설치:

```bash
yarn
```

2. 스크립트 실행:

```bash
node index.js
```

## 주의사항

- Notion API는 텍스트 컨텐츠를 2000자로 제한합니다. 더 긴 컨텐츠는 자동으로 잘립니다.
