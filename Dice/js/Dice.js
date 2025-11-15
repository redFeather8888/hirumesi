function Dice(Type){
    const canvas = document.getElementById('dice');
    const ctx = canvas.getContext('2d');

    // デバイスピクセル比を取得
    const dpr = window.devicePixelRatio || 1;
    // Canvasのサイズを調整
    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;
    // スケールを設定
    ctx.scale(dpr, dpr);

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    //ここまでがキャンバスの設定
    
    let squarePos = [{"x":0.5, "y": -0.5}, {"x":-0.5, "y": -0.5}, {"x":-0.5, "y": 0.5}, {"x":0.5, "y": 0.5}];
    let numberPos = {
        "1":[{"x":0, "y":0}],
        "2":[{"x":-1/4, "y":-1/4}, {"x":1/4, "y":1/4}],
        "3":[{"x":-1/4, "y":-1/4}, {"x":0, "y":0}, {"x":1/4, "y":1/4}],
        "4":[{"x":-1/4, "y":-1/4}, {"x":1/4, "y":-1/4}, {"x":-1/4, "y":1/4}, {"x":1/4, "y":1/4}],
        "5":[{"x":-1/4, "y":-1/4}, {"x":1/4, "y":-1/4}, {"x":0, "y": 0}, {"x":-1/4, "y":1/4}, {"x":1/4, "y":1/4}],
        "6":[{"x":-1/4, "y":-1/4}, {"x":-1/4, "y":0}, {"x":-1/4, "y":1/4}, {"x":1/4, "y":-1/4}, {"x":1/4, "y":0}, {"x":1/4, "y":1/4}]
    };
    let dicePattern = [
        ["1","6","5"],["2","5","4"],["3","4","2"],["4","3","2"],["5","2","1"],["6","4","5"]
    ];
    const charSize = 200;//表示する文字のサイズ
    let throwCount = 1;//サイコロを振れる回数
    let isUsed = false;//サイコロが使用中かどうか
    const squareSize = Math.min(canvasWidth, canvasHeight) * 0.1; // サイコロの一辺の長さ
    const pX = 0.15;//サイコロの中心座標（画面サイズが1x1）
    const pY = 0.35;
    const basePosX = canvasHeight - canvasHeight * pX;//X座標の初期位置（原点を画面左下にする）
    const basePosY = canvasWidth * pY;//Y座標の初期位置
    let centerPosX = basePosX;//X座標の基準位置
    let centerPosY = basePosY;//Y座標の基準位置
    const h = (canvasHeight - 2*squareSize - canvasHeight * pX) * 0.9;//放物線の高さ
    const x0 = centerPosX;//初期X座標
    const y0 = centerPosY;//初期Y座標
    const y1 = canvasWidth - y0;//最終到達点のY座標
    const deltaPosY = (y1 - y0) / 40;//１フレームごとのY座標の変化量
    const deltaAngle = Math.PI * 2 / 30;//１フレームごとの回転角
    let angle = 0//回転角
    let drawCount = 0;//表示する数字のカウント
    let drawNumber = dicePattern[drawCount % dicePattern.length];

    function drawDice(numbers, originPosX, originPosY, isDisplay) {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight); // 前の描画をクリア
        //ctx.save(); // 現在の状態を保存
        
        numbers.forEach((number,index) => {
            // サイコロの各面を描画
            ctx.beginPath();
            ctx.moveTo(originPosY, originPosX);
            squarePos.forEach((pos) => {
                const posX = squareSize * (pos["x"] + pos["y"] - 1) / 2;
                const posY = squareSize * (-pos["x"] + pos["y"]) * (3**0.5) /2;
                const posX2 = posX * Math.cos(angle + Math.PI*index * 2 / 3) - posY * Math.sin(angle + Math.PI*index * 2 / 3) + originPosX;
                const posY2 = posX * Math.sin(angle + Math.PI*index * 2 / 3) + posY * Math.cos(angle + Math.PI*index * 2 / 3) + originPosY;
                ctx.lineTo(posY2, posX2);
            });
            ctx.fillStyle = "black";
            ctx.stroke();
            ctx.fillStyle = "whitesmoke";
            ctx.fill();
            ctx.closePath();
            // 数字を描画
            if(isDisplay == true){
                let circlePos = numberPos[number];
                //ctx.save();
                circlePos.forEach((pos) => {
                    ctx.beginPath();
                    const posX = squareSize * (pos["x"] + pos["y"] - 1) / 2;
                    const posY = squareSize * (-pos["x"] + pos["y"]) * (3**0.5) /2;
                    const posX2 = posX * Math.cos(angle + Math.PI*index * 2 / 3) - posY * Math.sin(angle + Math.PI*index * 2 / 3) + originPosX;
                    const posY2 = posX * Math.sin(angle + Math.PI*index * 2 / 3) + posY * Math.cos(angle + Math.PI*index * 2 / 3) + originPosY;
                    const rX = squareSize * (2**0.5) / 8 / (Math.log2(number)+1);
                    const rY = squareSize * (6**0.5) / 8 / (Math.log2(number)+1);
                    ctx.ellipse(posY2, posX2, rY, rX, -angle - Math.PI*index * 2 / 3, 0, Math.PI * 2);
                    if(number=="1"){
                        ctx.fillStyle = "red";
                    }else{
                        ctx.fillStyle = "black";
                    }
                    ctx.fill();
                });
            }
        });
    }
    function drawText(number){
        ctx.font = String(charSize) + "px serif";
        ctx.fillStyle = "white";
        ctx.fillText(String(number), (canvasWidth-charSize)/2 + charSize * 0.25, canvasHeight/2);
    }
    function initDice(X, Y){drawDice(["1","2","3"], X, Y,true);};
    function spinDice(X, y, number){
        const finalNumber = (number - 1) % 6 + 1;//サイコロの目をランダムで決定
        isUsed = true;//サイコロ使用中に設定
        centerPosX = X;
        centerPosY = y;
        
        requestAnimationFrame(function animate() {
            centerPosY += deltaPosY;
            centerPosX = (centerPosY-y0)*(centerPosY-y1)*4*h / ((y1-y0)**2) + x0;
            
            if(angle >= Math.PI * 2/12){
                drawNumber = dicePattern[drawCount % dicePattern.length];
                //drawCount %= dicePattern.length
                drawCount++;
                angle = 0;
            }
            ctx.clearRect(0, 0, canvasWidth, canvasHeight); // 前の描画をクリア
            angle += deltaAngle;
            drawDice(drawNumber, centerPosX, centerPosY, true);
            
            if(centerPosX < x0 ){
                requestAnimationFrame(animate);
            }else{//アニメーション終了
                angle=0;
                drawDice(dicePattern[finalNumber-1], x0, y1, true);
                drawText(finalNumber);
                isUsed = false;//サイコロ使用終了に設定
            }
        });
    }
    switch(Type){
        case "init":
            initDice(centerPosX, centerPosY);
            break;
        case "spin":
            
            if(isUsed==false && throwCount>0){
                throwCount--;
                let centerPosX = basePosX;//X座標の基準位置
                let centerPosY = basePosY;//Y座標の基準位置
                const DiceNumber = 1//Rnd.Random(1,6);
                spinDice(centerPosX, centerPosY, DiceNumber);
                return DiceNumber;
            }
            
            break;
    }
}
document.addEventListener("DOMContentLoaded", function() {
    Dice("init");
});
document.addEventListener("click", function(event){
    Dice("spin");
})