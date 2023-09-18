//Global array to store object literals for commodities
var comObjects = [];

//array for items currently being displayed
const widgetsShowing = [];

var myChart;

//array for the dates of commosities prices
var dateArray = [];
//array for the price values of teh commodities
var valueArray = [];

//array for the dates of commosities prices
var dateArray2 = [];
//array for the price values of teh commodities
var valueArray2 = [];

//boolean variables for buttons clicked
var multiClicked;
var clearClicked;

//url for fetch request 1 and 2
var url1;
var url2;

//The name of the previous response for multi graph
var firstResponse = "";

//function that gets the commodities from the database via an async request
let startup = () => {
    //make an async request to get data from databse from server

    //url to store php file name
    var url = "getCommodities.php";

    //call function to get the commodity data from the database
    getStaticData("GET", url, "", processData);
}

//Muti-use Function that gets all the static data from our database
let getStaticData = (method, url, data, callback) =>{
    
    //declare an XHR object called request
    var request = new XMLHttpRequest();
    //if the data is an object set the header
    if (typeof testIfJson == "object") {
        request.setRequestHeader('Content-Type', 'application/json');
    }

    //specify the php script to open and the type of method used
    request.open(method, url);

    //if the method is a post method, set the request header
    if (method == "POST") {
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    }

    //onload function
    request.onload = function () {
        //store the response text in the response variable
        var response = request.responseText;
        callback(response);
    }
    //send the data
    request.send(data);

}


//function for sorting commodities alphabetically
function comSort(a, b){
    const comA = a.name.toUpperCase();
    const comB = b.name.toUpperCase();

    if(comA < comB){
        return -1;
    }
    if(comA > comB){
        return 1;
    }
    return 0;
}

//function that processes the response data from the request to the db
let processData = (response) => {
    //get the options object from webpage
    const options_list = document.getElementById('options_list');

    //store parsed json response in result variable
    let result = JSON.parse(response);

    //loop through response data
    for(let i = 0; i < result.length; i++){
        //create object literal grouping for each item in response
        var grouping = {
            id : result[i].id,
            name : result[i].name,
            information : result[i].information,
            code : result[i].code
        }
        //push the object literal to our comObjects array
        comObjects.push(grouping);
    }
    //sort the array alphabetically calling comSort function
    comObjects.sort(comSort);
    console.log(comObjects);

    //create a hidden first option so that the First item can be clicked and isnt by default selected
    //create drop down option element
    let option1 = document.createElement("option");
    //set its attributes
    option1.setAttribute("id", "hidden_option");
    option1.text = "Select a Commodity";
    //add hidden first option to the options drop list
    options_list.appendChild(option1);


    //populate the drop down lsit with options from the comarray
    for(let k = 0; k < comObjects.length; k++){
        //create drop down option element
        const option = document.createElement("option");
        //set its attributes
        option.setAttribute("id",comObjects[k].name);
        option.text = comObjects[k].name;
        option.value = comObjects[k].code;
        //add the options to the options drop list
        options_list.appendChild(option);
    }

    
    
    //onchange listener for when an item is clicked
    options_list.addEventListener("change", function() {
        //get the selected option from the list
        const itemSelected = options_list.selectedOptions[0];
        //get its name 
        const itemSelectedName = itemSelected.text;

        //if our place holder item is clicked do nothing
        if(itemSelectedName == 'Select a Commodity'){
            return;
        }

        //check if this is already displayed in widgetsShowing array
        if(widgetsShowing.includes(itemSelectedName)){
            //stop here
            return;
        }

        //otherwise add it to the currently shown items array
        widgetsShowing.push(itemSelectedName);

        //get the commodity in the object literal array with this value
        let w = comObjects.find(com => com.name === itemSelectedName);
        
        //make a widget by calling make widget function
        newWidget = new makeWidget(w.name, w.information);
    });

    

}


//Constructor Makes a widget with the values passed in
function makeWidget(name, information){
    //widget name value
    this.name = name;
    //widget details value
    this.information = information;
    
    //create a container div
    var container = document.createElement("div");

    //add to its list of classes
    container.classList.add("single_widget");

    //create button for deleting and give it an id
    var deleteButton = document.createElement("input");
    deleteButton.setAttribute("type", "button");
    deleteButton.setAttribute("id", "deleteButton");
    deleteButton.setAttribute("value", "Delete");

    //set its onlick functionality
    deleteButton.onclick = () =>{
        //get the dashboard div 
        dashboard = document.getElementById('dashboard_div');

        //reset the selected property of the droplist
        let options = document.getElementById('options_list');
        options.selectedIndex = 0; 

        //sever its ties to the child widget container
        dashboard.removeChild(container);

        //update the array of currently showing widgets
        let index = widgetsShowing.indexOf(this.name);
        widgetsShowing.splice(index,1);
    }

    //create the info and name labels and add the values to them
    var labelForName = document.createElement("h1");
    labelForName.textContent = name;
    var labelForInfo = document.createElement("h2");
    labelForInfo.textContent = information;


    //add the elements of the widget to the container div
    container.appendChild(labelForName);
    container.appendChild(labelForInfo);

    //create graph buton
    var graphButton = document.createElement("input");
    graphButton.setAttribute("type", "button");
    graphButton.setAttribute("id", "graph_button");
    graphButton.setAttribute("value", "Graph");
    container.appendChild(graphButton);

    //make graph button onclick to make request for prices
    graphButton.onclick  = function(){
        fetchPrice(name);
    }
    //create multi graph button and set attributes
    var multiButton = document.createElement("input");
    multiButton.setAttribute("type", "button");
    multiButton.setAttribute("id", "multi_button");
    multiButton.setAttribute("value", "Multi Graph");
    container.appendChild(multiButton);

    //Setting multi-graph buttons onclick to the multigraph function
    multiButton.onclick = function(){
        fetchMultiPrice(name);
    }


    //insert delete button
    container.appendChild(deleteButton);

    //add the container div to the dashboard
    let dashboard = document.getElementById("dashboard_div");
    dashboard.appendChild(container);
}


function fetchPrice(name){
    //set the multi button clicked to false
    multiClicked = false;
    //get the code for the request from the object literal array
    let item = comObjects.find(com => com.name == name);
    //write this values code to the console
    console.log(item.code);


    //the code for the request url
    var code = item.code;
    //alphavantage api key
    //apikey = "1W7QJ52ZXOIJ64BG";

    //define the request url
    url1 = 'https://www.alphavantage.co/query?function='+code+'&interval=monthly&apikey=1W7QJ52ZXOIJ64BG';

    //make a fetch request to the alphavantage api, call displaygraph
    fetch(url1,
        {method: "GET"}
    )
    .then(response=>response.json())
    .then(drawGraph);
}


//function to parse response then draw the graph with prices given
let drawGraph = (response) =>{
    //clear the arrays for date and values
    dateArray.splice(0, dateArray.length);
    valueArray.splice(0, valueArray.length);

    //give firstReponse the value of the name of the item clicked
    firstResponse = response.name;

    console.log(response);

    //if there is already a graph displayed delete it
    if(myChart){
        myChart.destroy();
    }
    
    //loop through the data for each month and price
    for(let i =0; i < response.data.length; i++){
        //get the date
        let date = response.data[i].date;
        //add this to the array
        dateArray.push(date);

        //get the value
        let value = response.data[i].value;
        //add this to the valueArray
        valueArray.push(value);
    }

    //line graph object literal
    const data = {
        labels: dateArray,
        datasets: [
            {
                label: response.name,
                data: valueArray,
                

            },
        ],
    };


    //group the data for drawing
    const setup = {
        type: "line",
        data: data,
    }
    //draw the graph
    myChart = new Chart(
        document.getElementById('graph_canvas'),
        setup
    );

}

function fetchMultiPrice(name){

    //if there remains data from the last multi click return
    if(dateArray2 > 0){
        alert("Select a new graph before comapring again");
        return;
    }
    //get the code for the request from the object literal array
    let item = comObjects.find(com => com.name == name);
    //write this values code to the console
    console.log(item.code);


    //the code for the request url
    var code = item.code;
    //alphavantage api key
    //apikey = "1W7QJ52ZXOIJ64BG";
    

    //url for 2nd alphavantage fetch request
    url2 = 'https://www.alphavantage.co/query?function='+code+'&interval=monthly&apikey=1W7QJ52ZXOIJ64BG';

    //make a fetch request to the alphavantage api, call displaygraph
    fetch(url2,
        {method: "GET"}
    )
    .then(response=>response.json())
    .then(multiGraph);
    
}


let multiGraph = (response) =>{

    console.log(response);
    //if a graph isnt displayed or multi has already been clicked dont do anything and display a message
    if(!myChart || multiClicked == true){
        alert("Please add a graph to compare with, or click clear");
        return;
    }

    

    //if there is already a graph displayed delete it
    if(myChart){
        myChart.destroy();
    }
    
    //loop through the data for each month and price
    for(let i =0; i < response.data.length; i++){
        //get the date
        let date = response.data[i].date;
        //add this to the array
        dateArray2.push(date);

        //ge the value
        let value = response.data[i].value;
        //add this to the valueArray
        valueArray2.push(value);

    }
    var data;


    //if there is no existing graph, draw the new graph alone
    if(firstResponse == ""){
        //line graph object literal
        data = {
            labels: dateArray2,
            datasets: [
                {
                    label: response.name,
                    data: valueArray2,
                }
            ],
        };

    }
    else{
        //line graph object literal for 2 datasets
        data = {
            labels: dateArray, dateArray2,
            datasets: [
                {
                    label: firstResponse,
                    data: valueArray,

                },
                {
                    label: response.name,
                    data: valueArray2,
                }
            ],
        };

    }
    


    //the drawing data for the graph
    const setup = {
        type: "line",
        data: data,
    }

    //draw the graph
    myChart = new Chart(
        document.getElementById('graph_canvas'),
        setup
    );


    //clear the first array
    //clear any previous data from the array
    dateArray2.splice(0, dateArray.length);
    valueArray2.splice(0, valueArray.length);
    url1 = "";
    url2 = "";

    firstResponse = "";
    //set multibutton clicked to true
    multiClicked = true;


}


//Clears the graph(s) from the canvas
function clearCanvas(){
    
    //if a chart exists delete it from the canvas
    if(myChart){
        myChart.destroy();
    }
    //set clearClicked to true
    clearClicked = true;

    //clear/reset all data
    valueArray.length = 0;
    valueArray2.length = 0;
    dateArray.length = 0;
    dateArray2.length = 0;
    url1 = "";
    url2 = "";
    multiClicked = false;

    
}