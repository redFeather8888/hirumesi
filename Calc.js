function OnButtonClick() {
    //target = document.getElementById("budget");
    //target.value = "2025";
    main()
}

function main(){
    //ListItemPriceとListItemIDはセットで扱う
    ListItemPrice=[];//単品価格
    ListItemID=["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
    ListPurchased=[];//購入が確定している商品の価格
    //ListAllPatternとListAllPriceはセットで扱う
    ListAllPattern=[];//全ての組み合わせ
    ListAllPrice=[];//全ての組み合わせの金額
    ListResult1st=[];//ピッタリな組み合わせ
    ListResult2nd=[];//次にピッタリ
    ListResult3rd=[];//次の次にピッタリ

    budget=0;//予算
    sumPurchased=0;//購入が確定している商品の合計金額
    maxSum=0;//上限金額

    if(getInputData()==true){//入力内容が正しい
        for(var i=0; i<ListPurchased.length; i++){//購入が確定している商品の合計金額
            sumPurchased=sumPurchased+ListPurchased[i];
        }
        budget=document.getElementById("budget").value;//予算
        maxSum=budget-sumPurchased;//上限金額を計算する
        calcAllPattern(maxSum);
        calcResult();
        showResult();
    }else{

    }
}

function getInputData(){//入力データを確認して配列に入れる
    flag=true;
    const itemTable=document.getElementById("itemPrice");
    const purchasedTable=document.getElementById("purchasedPrice");

    for (var i=1; i < itemTable.rows.length; i++) {//単品価格
        itemPriceElm=itemTable.rows[i].cells[0].children[0];
        itemPrice=Number(itemPriceElm.value);

        if(Number.isInteger(itemPrice)==true){//単品価格が自然数
            if(itemPrice>0){
                ListItemPrice.push(itemPrice);
            }

        }else{
            flag=false;
        }
    }

    for (var i=1; i < purchasedTable.rows.length; i++) {//購入リスト
        purchasedPriceElm=purchasedTable.rows[i].cells[0].children[0];
        purchasedPrice=Number(purchasedPriceElm.value);

        if(Number.isInteger(purchasedPrice)==true){//購入商品価格が自然数
            if(purchasedPrice>0){
                ListPurchased.push(purchasedPrice);
            }

        }else{
            flag=false;
        }
    }
    
    if(ListItemPrice.length>0){
        AscendingOrder(ListItemPrice);
        DeleteDuplicate(ListItemPrice);
        AscendingOrder(ListPurchased);
        DeleteDuplicate(ListPurchased);
    }else{
        flag=false;
    }
    return flag;
}
function AscendingOrder(array){//昇順に並び替え
    for(let outer = 0; outer < array.length -1; outer++){
        for(let i = array.length-1; i > outer; i--){    
            if(array[i] < array[i-1]){
                let tmp = array[i];
                array[i] = array[i-1];
                array[i-1] = tmp;
            }
        }
    }
}
function DeleteDuplicate(array){//昇順・降順の配列から重複を消す
    for(var i=array.length-1; i >0 ; i--){
        if(array[i] == array[i-1]){
            array.splice(i,1);
        }
    }
}

function calcAllPattern(maxSum){//全パターンを計算する
    Sum=0;
    pattern="X";

    if(maxSum<ListItemPrice[0]){//使える金額が単品の最小価格よりも小さい場合中断
        return false;
    }

    do{
        if(!(pattern.slice(-1)=="A")){//末端がAではないなら末尾に文字をつける
            if(pattern=="X"){
                pattern=ListItemID[ListItemPrice.length-1];
                
            }else{
                pattern=pattern+pattern.slice(-1);//末尾の文字
            }
        }

        Sum=0;
        for(var i=0; i<pattern.length; i++){//合計金額を計算する
            Sum=Sum+ListItemPrice[ListItemID.indexOf(pattern.slice(i, i+1))];
        }
        
        while(Sum>maxSum || ListAllPattern.indexOf(pattern)>-1){//合計金額が上限金額より高いorパターンリストに含まれている間ループ
            if(pattern.slice(-1)=="A"){
                pattern=pattern.slice(0, pattern.length - 1);//末端を消す
            }
            pattern=pattern.slice(0,pattern.length-1)+ListItemID[ListItemID.indexOf(pattern.slice(-1))-1];//末尾の文字を１つずらす

            Sum=0;
            for(var i=0; i<pattern.length; i++){//合計金額を計算する
                Sum=Sum+Number(ListItemPrice[ListItemID.indexOf(pattern.slice(i, i+1))]);
            }
        }
        ListAllPattern.push(pattern);
        ListAllPrice.push(Sum);
    }while(!(pattern=="A"));
    
    return true;
}

function calcResult(){//条件に合うパターンを計算する
    DeleteDuplicate(ListAllPrice);//取りうる金額のパターンを調べる
    arr=ListAllPrice.slice();
    AscendingOrder(arr);
    DeleteDuplicate(arr);
    message=""
    const sum1st=arr[arr.length-1];
    const sum2nd=arr[arr.length-2];
    const sum3rd=arr[arr.length-3];

    for(var i=0; i<ListAllPrice.length; i++){
        if(ListAllPrice[i]==sum1st){
            ListResult1st.push(ListAllPattern[i]);
        }
    }
    for(var i=0; i<ListAllPrice.length; i++){
        if(ListAllPrice[i]==sum2nd){
            ListResult2nd.push(ListAllPattern[i]);
        }
    }
    for(var i=0; i<ListAllPrice.length; i++){
        if(ListAllPrice[i]==sum3rd){
            ListResult3rd.push(ListAllPattern[i]);
        }
    }
}

function showResult(){//結果を表示する
    resutlTable=document.getElementById("result");
    num=0;
    function addTableData(num, data, colorCode){
        let tr = document.createElement("tr");
        let td1 = document.createElement("td");
        td1.innerText = num;
        let td2 = document.createElement("td");
        td2.innerText = data;
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.style.backgroundColor=colorCode
        resutlTable.appendChild(tr);
    }
    function convID(ID){
        var i=0;
        var j=1
        var str="";
        do{
            i=j;
            do{
                j++;
            }while(ID.slice(i-1, i)==ID.slice(j-1, j));

            if(!str==""){
                str = str + "、 "
            }
            str = str + String(ListItemPrice[ListItemID.indexOf(ID.slice(i-1, i))]) + "円 × " + String(j-i);
        }while(j<=ID.length);

        return str;
    }
    var rowNum=resutlTable.rows.length;
    for(var i=rowNum-1; i>0; i--){
        resutlTable.deleteRow(i);
    }

    for(var i=0; i<ListResult1st.length; i++){
        num++;
        addTableData(num, convID(ListResult1st[i]),"#87cefa");
    }
    for(var i=0; i<ListResult2nd.length; i++){
        num++;
        addTableData(num, convID(ListResult2nd[i]),"#ffffe0");
    }
    for(var i=0; i<ListResult3rd.length; i++){
        num++;
        addTableData(num, convID(ListResult3rd[i]),"#f08080");
    }
}