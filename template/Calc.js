document.addEventListener("DOMContentLoaded", () => {
    init();
    document.getElementById("button").addEventListener("click", () => {
        OnButtonClick();
    });
});
function OnButtonClick() {
    main()
}
function init(){
    const TableRow = 8;
    const DefaultItemPrice = ["44", "77", "99", "121", "132", "154"];
    let ElmFrag = document.createDocumentFragment();
    let ElmFrag2 = document.createDocumentFragment();
    for(let i=0;i<TableRow;i++){
        const ElmInput = document.createElement("input");
        ElmInput.type = "number";
        ElmInput.value = (i<DefaultItemPrice.length)?DefaultItemPrice[i]:"";
        const ElmTd = document.createElement("td");
        ElmTd.append(ElmInput);
        const ElmTr = document.createElement("tr");
        ElmTr.append(ElmTd);
        ElmFrag.append(ElmTr);

        const ElmInput2 = document.createElement("input");
        ElmInput2.type = "number";
        const ElmTd2 = document.createElement("td");
        ElmTd2.append(ElmInput2);
        const ElmTr2 = document.createElement("tr");
        ElmTr2.append(ElmTd2);
        ElmFrag2.append(ElmTr2);
        
        const itemTable=document.getElementById("itemPrice");
        itemTable.append(ElmFrag);
        const purchasedTable=document.getElementById("purchasedPrice");
        purchasedTable.append(ElmFrag2);
    }
}
function main(){
    //ListItemPriceとListItemIDはセットで扱う
    let ListItemPrice=[];//単品価格
    const ListItemID=["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
    let ListPurchased=[];//購入が確定している商品の価格
    //ListAllPatternとListAllPriceはセットで扱う
    let ListAllPattern=[];//全ての組み合わせ
    let ListAllPrice=[];//全ての組み合わせの金額
    let ListResult1st=[];//ピッタリな組み合わせ
    let ListResult2nd=[];//次にピッタリ
    let ListResult3rd=[];//次の次にピッタリ

    let budget=0;//予算
    let sumPurchased=0;//購入が確定している商品の合計金額
    let maxSum=0;//上限金額

    if(getInputData(ListItemPrice, ListPurchased)==true){//入力内容が正しい
        for(let i=0; i<ListPurchased.length; i++){//購入が確定している商品の合計金額
            sumPurchased=sumPurchased+ListPurchased[i];
        }
        budget=document.getElementById("budget").value;//予算
        maxSum=budget-sumPurchased;//上限金額を計算する
        calcAllPattern(maxSum, ListItemID, ListItemPrice, ListAllPattern, ListAllPrice);
        calcResult(maxSum, ListAllPattern, ListAllPrice, ListResult1st, ListResult2nd, ListResult3rd);
        showResult(ListItemID, ListItemPrice, ListResult1st, ListResult2nd, ListResult3rd);
    }
}
function getInputData(ListItemPrice, ListPurchased){//入力データを確認して配列に入れる
    let flag=true;
    const itemTable=document.getElementById("itemPrice");
    const purchasedTable=document.getElementById("purchasedPrice");

    for (let i=1; i < itemTable.rows.length; i++) {//単品価格
        const itemPriceElm=itemTable.rows[i].cells[0].children[0];
        const itemPrice=Number(itemPriceElm.value);

        if(Number.isInteger(itemPrice)==true){//単品価格が自然数
            if(itemPrice>0){
                ListItemPrice.push(itemPrice);
            }
        }else{
            flag=false;
        }
    }
    for (let i=1; i < purchasedTable.rows.length; i++) {//購入リスト
        const purchasedPriceElm=purchasedTable.rows[i].cells[0].children[0];
        const purchasedPrice=Number(purchasedPriceElm.value);

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
    for(let i=array.length-1; i >0 ; i--){
        if(array[i] == array[i-1]){
            array.splice(i,1);
        }
    }
}
function calcAllPattern(maxSum, ListItemID, ListItemPrice, ListAllPattern, ListAllPrice){//全パターンを計算する
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
        for(let i=0; i<pattern.length; i++){//合計金額を計算する
            Sum=Sum+ListItemPrice[ListItemID.indexOf(pattern.slice(i, i+1))];
        }  
        while(Sum>maxSum || ListAllPattern.indexOf(pattern)>-1){//合計金額が上限金額より高いorパターンリストに含まれている間ループ
            if(pattern.slice(-1)=="A"){
                pattern=pattern.slice(0, pattern.length - 1);//末端を消す
            }
            pattern=pattern.slice(0,pattern.length-1)+ListItemID[ListItemID.indexOf(pattern.slice(-1))-1];//末尾の文字を１つずらす

            Sum=0;
            for(let i=0; i<pattern.length; i++){//合計金額を計算する
                Sum=Sum+Number(ListItemPrice[ListItemID.indexOf(pattern.slice(i, i+1))]);
            }
        }
        ListAllPattern.push(pattern);
        ListAllPrice.push(Sum);
    }while(!(pattern=="A"));
    
    return true;
}
function calcResult(maxSum, ListAllPattern, ListAllPrice, ListResult1st, ListResult2nd, ListResult3rd){//条件に合うパターンを計算する
    DeleteDuplicate(ListAllPrice);//取りうる金額のパターンを調べる
    arr=ListAllPrice.slice();
    AscendingOrder(arr);
    DeleteDuplicate(arr);
    message=""

    if(arr[arr.length-1]==maxSum){//ピッタリ価格が存在する場合
        sum1st=arr[arr.length-1];
        sum2nd=arr[arr.length-2];
        sum3rd=arr[arr.length-3];
    }else{
        sum1st=-1;//価格は自然数
        sum2nd=arr[arr.length-1];
        sum3rd=arr[arr.length-2];
    }
    for(let i=0; i<ListAllPrice.length; i++){
        if(ListAllPrice[i]==sum1st){
            ListResult1st.push(ListAllPattern[i]);
        }
    }
    for(let i=0; i<ListAllPrice.length; i++){
        if(ListAllPrice[i]==sum2nd){
            ListResult2nd.push(ListAllPattern[i]);
        }
    }
    for(let i=0; i<ListAllPrice.length; i++){
        if(ListAllPrice[i]==sum3rd){
            ListResult3rd.push(ListAllPattern[i]);
        }
    }
}
function showResult(ListItemID, ListItemPrice, ListResult1st, ListResult2nd, ListResult3rd){//結果を表示する
    function addTableData(num, data, colorCode, Fragment){
        const td1 = document.createElement("td");
        td1.innerText = num;
        td1.style.textAlign="center"
        const td2 = document.createElement("td");
        td2.innerText = data;
        const tr = document.createElement("tr");
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.style.backgroundColor=colorCode
        Fragment.appendChild(tr);
    }
    function convID(ID){
        let i=0;
        let j=1
        let str="";
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
    const resutlTable=document.getElementById("result");
    let num=0;
    const rowNum=resutlTable.rows.length;
    for(let i=rowNum-1; i>0; i--){
        resutlTable.deleteRow(i);
    }
    const ElmFrag = document.createDocumentFragment();
    for(let i=0; i<ListResult1st.length; i++){
        num++;
        addTableData(num, convID(ListResult1st[i]),"#87cefa", ElmFrag);
    }
    for(let i=0; i<ListResult2nd.length; i++){
        num++;
        addTableData(num, convID(ListResult2nd[i]),"#ffffe0", ElmFrag);
    }
    for(let i=0; i<ListResult3rd.length; i++){
        num++;
        addTableData(num, convID(ListResult3rd[i]),"#f08080", ElmFrag);
    }
    resutlTable.append(ElmFrag);
}