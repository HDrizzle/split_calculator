// how to use chart.js: https://www.w3schools.com/js/js_graphics_chartjs.asp

// ------------------------------- update data -------------------------------
function startUpdate()
{
	//asyncRequest(action, dir, sendString, contentType, doneCallback, statusElement, userMessages)
	asyncRequest(
		"GET",
		"stats.json",
		"",
		"",
		function(code, data){if(code == 200){dataRetrieved(data)}},
		document.getElementById("update-status")
	)
}

function dataRetrieved(data)
{
	// store data
	window.serverLog = JSON.parse(data)
	// update IP address table
	updateIPAddresses();
}

function updateIPAddresses()
{
	var data = window.serverLog;
	// better format
	var IPs = Object();// <IP>: [<most recent visit>, <# of visits>]
	for(i = 0; i < data.length; i++)
	{
		if(Object.hasOwn(IPs, data[i].ip))// IP address is already in IPs
		{
			var entry = IPs[data[i].ip];
			if(entry[0] < data[i].t)
			{
				entry[0] = data[i].t;
			}
			entry[1]++;
		}
		else
		{
			IPs[data[i].ip] = [data[i].t, 1];
		}
	}
	// modify document
	var e = document.getElementById("ip-address-table-data");
	e.innerHTML = "<tr><th>Address</th><th># of visits</th><th>Most recent visit</th></tr>";
	var orderedKeys = Object.keys(IPs);
	for(i = 0; i < orderedKeys.length; i++)
	{
		var IP = orderedKeys[i];
		e.innerHTML += "<tr><td><code>" + IP + "</code></td><td>" + IPs[IP][1] + "</td><td>" + timeStampToDateTime(IPs[IP][0]) + "</td></tr>";
	}
}


// ------------------------------- plotting -------------------------------
function plotVisitHistogram()
{
	// get data
	var timeRangeMin = Date.now() - (3600 * 24);
	var subset = [];
	for(i = 0; i < window.serverLog.length; i++)
	{
		var entry = window.serverLog[i];
		if(entry.t >= timeRangeMin)
		{
			subset.push(entry);
		}
	}
	// plot
	new Chart("site-visits-histogram", {
		type: "bar",
		data:
		{
			// TODO
		},
		options:
		{
			legend: {display: false},
			title:
			{
			 	display: true,
				text: "World Wine Production 2018"
			}
		}
	});
}


// ------------------------------- onload -------------------------------
window.onload = function()
{
	startUpdate();
}