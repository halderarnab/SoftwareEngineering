//Arnab Halder, ash186.
//Part B: Client.
const callURL = async function (serverURL, text) {
    var list = []; //list to store all the delays.
    for (var i = 0; i < 20; i++) {
        //Request object.
        var myRequest = new Request(serverURL, {
            method: "POST",
            body: text,
        });
        //Setting the request header.
        myRequest.headers.set("Content-Type", "text/plain");
        //fetching the API.
        await fetch(myRequest)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                //response.json() is a Promise which is resolved using the .then() function.
                response.json().then((res) => {
                    //Create a random delay between 0 and "rtt". "rtt" (milliseconds) as measured in Part A.
                    let delay = Math.random() * res.rtt;
                    //Push this delay to the list.
                    list.push(delay);
                    //The callback function inside setTimeout() helps in simulating the delay from server to client.
                    //This simulation can only be ensured by performing the actions inside the callback function.
                    setTimeout(() => {
                        console.log("Response received:", res.data == text);
                        console.log("Ending delay of:", delay);
                    }, delay);
                });
            });
    }
    console.log(list);
}

let text = "text_1";

const serverURL = "http://localhost:8080/";

callURL(serverURL, text);

module.exports = { callURL };