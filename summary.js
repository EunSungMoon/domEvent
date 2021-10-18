/****************************************************************************************************************
 이벤트 정리(출처 : 모던 자바스크립트)

 1.문서
 1.1 브라우저 환경과 다양한 명세서
  window : 루트객체
    - js코드의 전역 객체
    - 브라우저 창을 대변, 제어할수 있는 메소드 제공

  -> DOM (document...)
  -> BOM (navigator, screen, loaction, frames, hitory, XMLHttpRequest...)
  -> js (Object, Array, Function...)

  DOM : 웹 페이지 내의 모든 콘텐츠를 객체로 나타내줌. 수정 가능. document객체는 페이지의 기본 진입점
  BOM : 문서 이외의 모든 것을 제어하기 위한 브라우저가 제공하는 추가 객체 (질문! bom이랑 web api랑 같은거 같애...)

  1.2 dom 트리
    dom에 따르면 모든 html 태그는 객체, html안에 있는 주석도 dom을 구성한다

  1.3 dom 탐색
    dom에서 null은 '존재하지 않음'을 의미
    childNodes는 배열이 아닌 반복 가능한(이터러블) 유사배열 객체 -> 컬렉션
    - for of 문 사용 가능 (for in문 사용 금지)
    - 배열이 아님 => 배열 메소드 사용 불가능
   
   **dom 컬렉션은 읽는 것 만 가능
    
  1.4 주요 노드 프로퍼티
    nodeName(모든 node에 있음), tagName(요소 노드에만 존재)
    innerHTML : 
      +=사용시 주의점 : 추가 아님 기존 내용 삭제, 새로운 내용을 합쳐서 다시 출력 성능면에서 안 좋음 
      추가하는 대안 방법이 있는데 그걸 뭔지 안알려줬네
       insertAdjacentHTML() 이거 인듯?

    outerHTML
    nodeValue/data
    textContent : 요소 내의 텍스트 접근 테그 제외 텍스트만 추출 (innerHTML은 문자열이 html형태로 함께 저장, 이거는 순수 텍스트만)

  1.5 속성과 프로퍼티
    비표준 속성, dataset
    data-*** 요런거 꼭 data일 필요는 없고 상황에 맞게
  
  1.6 
    노드 삭제 node.remove()
    노드 복제 node.cloneNode()
    노드 삽입 node.append prepend before after replaceWith 
    insertAdjacentHTML(where, html) -> where : beforebegin afterbegin beforeend afterend

  1.7 스타일과 클래스
  1.8 좌표
    좌표 얻는 함수 getBoundingClientRect()
    top : 위에서 글씨 꼭대기까지
    bottom : 위에서 글씨 맨 바닥까지()
    left : 왼쪽 부터 글씨 첫 시작
    right : 왼쪽 부터 글씨 마지막
  
**돔 추가할 때
추가할 돔을 배열에 넣은다
예시)
t=[];
let $target = $(this).siblings('ul');
let name =$target.attr('data-name);
t.push(`추가할 dom`);
$($target).append(t);

2. 이벤트 기초
  2.1 브라우저 이벤트 소개
    이벤트 : 무언가 일어났다는 신호
    이벤트에 반응하려면 이벤트 발생 시 실행되는 헨들러라는 함수르 할당해야됨
    **주의점
    setAttribute로 헨들러 할당 금지 document.body.setAttribute('onclick', function(){alert(1)}) <- 동작 안함
    dom프로퍼티는 대소문자 구분

    헨들러 : addEventListener
    헨들러 삭제 : removeEventListener 삭제는 동일한 함수만 가능
    헨들러 여러개 사용 가능

    event.type : 클릭, 같은 애들
    event.currentTarget : 이벤트 처리 요소. 화살표 함수를 사용해 핸들러를 만들거나 다른 곳에 바인딩하지 않은 경우 this가 가리키는 값과 같음
                          화살표 함수를 사용했거나 함수를 다른 곳에 바인딩하는 경우 이것을 사용해 이벤트가 처리되는 요소정보 얻을 수 있음

  2.2 버블링 캡처링
    버블링 : 한 요소에서 이벤트가 발생하면 요소에 할당된 핸들러가 동작하고 이어 부모요소의 핸들러가 동작 -> 가장 최상단의 조상요소를 만날때까지 반복
    - event.target
      this(=currentTarget) vs target
      target은 실제 이벤트가 시작된 요소 -> 버블링이 진행되도 변하지 않음
      this는 현재 요소 -> 현재 실행 중인 핸들러가 할당된 요소 참조
        
      버블링 중단하기 : event.stopPropagation() 그러나 꼭 필요한 경우가 아니라면 사용 자제
    캡처링 : 실제 코드에선 잘 쓰이지 않지만 종종 유용함 알고만 있으렴
      캡처링 단계 : 이벤트가 하위요소로 전파되는 단계
      타깃 단계 : 이벤트가 실제 타깃 요소에 전달되는 단계
      버블링 단계 : 이벤트가 상위요소로 전파되는 단계
      
  2.3 이벤트 위임 (캡처링, 버블링 활용)
    이벤트 위임은 알고리즘으로 동작
    핸들러의 e.target을 사용해 이벤트가 발생한 요소가 어딘지 알아낸다
    원하는 요소에서 이벤트가 발생했다고 확인되면 이벤트를 핸들링한다

    장점 : 많은 핸들러를 할당하지 않아도 됨
    요소 추가, 제거 할 때 해당 요소에 할당도니 핸들러를 추가하거나 제거할 필요가 없기 떄문에 코드 짧아짐
    innerHTML이나 유사한 기능을 하는 스크립트로 요소 덩어리 수정하는데 쉬워짐
    단점 : 이벤트가 반드시 버블링 되야함 그러나 몇몇 이벤트는 버블링되지 않음, 낮은 레벨에 할당된 핸들러에는 stopPropagation 사용안됨
    cpu작업 부하 늘어남 그러나 무시할만한 수준이어서 실제론 고려안함.

  2.4 브라우저 기본 동작
    브라우저 기본 동작 막기 : event.preventDefault()
    <button> 테그가 아닌 곳에 링크를 만들 때 <a>태그
    - '마우스 오른쪽 버튼을 클릭' 기능을 사용할 수 있다
****************************************************************************************************************/

  //2.1 헨들러 삭제 동일 함수, 여러개 가능
  function handler1() {
    console.log('handler1');
  }

  function handler2() {
    console.log('handler2');
  }

  document.addEventListener('click', handler1);
  document.removeEventListener('click', handler1);
  document.addEventListener('click', handler2);

  //currentTarget
  //html : <button id ='elem'>click</button>
    let obj = {
    handleEvent(e) {
      console.log(`${e.type} 이벤트 ${e.currentTarget} 에서 발생`);
    } //click 이벤트 [object HTMLButtonElement] 에서 발생
  };
  
  document.querySelector('#elem').addEventListener('click', obj);
  console.log(elem); 

  //왓챠피디아에서 하고 싶은 것 nav, 페이지이동, 이벤트 버블링