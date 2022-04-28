# 계정 장부 프로그램
친구에게 *'여기저기 가입되어 있는 계정이 너무 많아서 계정 정보를 자주 잊어버린다. 보기 쉽고 편한 장부같은 프로그램 만들어주면 좋겠다.'* 라는 요청을 받아 제작하게 되었습니다. 

## 스크린샷
<img src="https://user-images.githubusercontent.com/27776795/165788540-f5c05041-4b1b-4c26-951f-0dd048169750.png" width="49%" title="메인 화면" alt="메인 화면"></img>
<img src="https://user-images.githubusercontent.com/27776795/165789673-9dec429b-4a34-46ab-af6b-aa5ad14381b6.png" width="49%" title="등록 화면" alt="등록 화면"></img>

## 사용 기술
- Electron.js
- React.js
- Mobx
- Antd + Styled-components

## 콘텐츠 소개
### 메인화면
![메인 화면](https://user-images.githubusercontent.com/27776795/165788540-f5c05041-4b1b-4c26-951f-0dd048169750.png)
계정을 등록하면 위 화면대로 나타납니다. 가독성과 가시성을 위해 카드형 리스트로 배치하고 좌측엔 그룹 영역으로 구성하였습니다. 계정 등록시, 해당 웹사이트의 favicon을 파싱하여 더욱 쉽게 구분할 수 있도록 구현했습니다.

### 등록 & 수정화면
![등록 화면](https://user-images.githubusercontent.com/27776795/165789673-9dec429b-4a34-46ab-af6b-aa5ad14381b6.png)
계정을 등록하고 수정하는 화면입니다. 해당 웹사이트를 다른 플랫폼으로 가입했을 경우, 연동된 계정을 선택할 수 있도록 구현했습니다.

favicon이 파싱되지 않거나, 다른 favicon으로 바꾸길 원한다면 직접 선택하여 저장할 수 있습니다.

등록한 계정 데이터들은 각 로컬 환경에 설치됩니다. (*Window - C:\Users\유저\AppData\Roaming\amp\storage*)

<img src="https://user-images.githubusercontent.com/27776795/165792570-0e7d85d0-6801-41dd-8d9f-246c728edfbe.png" width="49%" title="메인 화면" alt="메인 화면"></img>
<img src="https://user-images.githubusercontent.com/27776795/165792616-f04c71c0-e4c9-41f9-a882-85d305aef8e1.png" width="49%" title="등록 화면" alt="등록 화면"></img>

### 윈도우 트레이
![트레이](https://user-images.githubusercontent.com/27776795/165793183-18c5c5d9-9ae3-4f64-8114-4bc47d138877.PNG)

쉽고 간편한 접근을 위해 트레이 아이콘을 적용했습니다. 앱을 닫아도 트레이를 통해 쉽게 오픈할 수 있습니다.