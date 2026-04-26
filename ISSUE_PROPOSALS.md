# 작업 제안서 (코드베이스 점검 결과)

아래는 현재 코드베이스를 빠르게 점검한 뒤 정리한 **우선순위 작업 4건**입니다.

## 1) 오탈자 수정 작업
### 제안
- 카테고리/경로 명칭 `lattecolection`(l 1개) → `lattecollection`(l 2개)로 통일.

### 근거
- 카테고리 파일명과 포스트 경로에서 동일 오탈자가 반복됨.
  - `_category/lattecolection.md`
  - `_posts/lattecolection/2026-04-01-caffe-latte.md`

### 기대 효과
- URL/카테고리 네이밍 일관성 개선
- 검색/내부 링크 관리 시 혼동 감소

---

## 2) 버그 수정 작업
### 제안
- `assets/js/latte-gacha.js`에 DOM 존재 여부 가드 추가.
- `.gacha__action_btn`, `.gacha__result`, `.gacha__desc`가 없는 페이지에서는 조용히 종료하도록 개선.

### 예시
```js
const gachaBtn = document.querySelector(".gacha__action_btn");
const gachaResult = document.querySelector(".gacha__result");
const gachaDesc = document.querySelector(".gacha__desc");

if (!gachaBtn || !gachaResult || !gachaDesc) {
  // 가챠 UI가 없는 페이지에서는 아무 것도 하지 않음
  return;
}
```
- 적용 포인트: 이벤트 바인딩(`addEventListener`) 전에 위 가드를 넣어 페이지별 스크립트 에러를 차단.

### 근거
- 현재 스크립트는 요소가 없을 때도 `gachaBtn.addEventListener(...)`를 호출하므로, 특정 페이지에서 런타임 에러 가능성이 있음.

### 기대 효과
- 가챠 위젯이 없는 페이지에서도 전역 JS 안전성 확보
- 콘솔 에러 감소 및 회귀 위험 축소

---

## 3) 코드 주석/문서 불일치 수정 작업
### 제안
- README에 실제 기능 범위(예: Latte Gacha 페이지 존재, 주요 정보 페이지 링크)를 2~3줄로 명시.
- 또는 `_info/lattegacha.md` 상단에 기능 설명/주의사항을 문서형으로 추가해 include 마크업만 있는 상태를 보완.

### 근거
- `README.md`는 현재 매우 간략하여 실제 제공 기능(라떼 가챠 등)과 사용자가 기대하는 문서 정보가 어긋남.
- `_info/lattegacha.md`는 include 호출 중심이라 기능 의도/동작 제약이 드러나지 않음.

### 기대 효과
- 신규 기여자 온보딩 속도 향상
- 문서-구현 간 인지 부조화 감소

---

## 4) 테스트 개선 작업
### 제안
- 최소 smoke test 도입:
  1. Jekyll 빌드 성공 여부(`bundle exec jekyll build`)
  2. 핵심 페이지 렌더링 확인(`index.html`, `lattegacha` 페이지)
  3. 가챠 JS 기본 동작(요소 없음/데이터 없음) 검증
- GitHub Actions에 CI 워크플로우 추가하여 PR마다 자동 실행.

### 예시
- 로컬/CI에서 공통으로 실행할 스모크 테스트 예시:
```bash
bundle exec jekyll build
test -f _site/index.html
test -f _site/info/lattegacha/index.html
```
- JS 회귀 방지용 테스트(예: Vitest + jsdom) 시나리오 예시:
  - **케이스 A**: 가챠 DOM이 전혀 없는 문서에서 스크립트를 로드해도 예외가 발생하지 않아야 함.
  - **케이스 B**: `#latte-data`가 비어 있거나 `[]`일 때 버튼 클릭 시 “준비 중 ...” 문구가 노출되어야 함.
- GitHub Actions 워크플로우 예시:
  - PR 트리거 시 `bundle install` → `bundle exec jekyll build` → 스모크 테스트 스크립트 실행.

### 근거
- 저장소에 테스트/CI 설정이 거의 없어, 사소한 수정에도 정적 사이트/스크립트 회귀를 즉시 감지하기 어려움.

### 기대 효과
- 배포 전 품질 게이트 확보
- 프론트 JS 회귀 조기 탐지

---

## 권장 우선순위
1. 버그 수정(2)
2. 테스트 개선(4)
3. 오탈자 수정(1)
4. 문서 불일치 수정(3)
