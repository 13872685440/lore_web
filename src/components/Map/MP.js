const ak = "hYDUghtNiW1RZHHp5c2QrEVooh3Qvts4"

export function MP() {  
  return new Promise(function (resolve, reject) {  
    window.onload = function () {  
      resolve(BMap)  
    }  
    var script = document.createElement("script");  
    script.type = "text/javascript";  
    script.src = "http://api.map.baidu.com/api?v=2.0&ak="+ak+"&callback=init";  
    script.onerror = reject;  
    document.head.appendChild(script);  
  })  
}