/* main JS file, by Hadrian Ward
*  "type" (int) refers to either "race" (0), "split" (1), or "speed" (2)
*  default length measurement is in meters, unless otherwise noted
*/


// ------------------------------- UI update -------------------------------
function update(source)
{
	var speed = getSpeed(source);
	var typesToUpdate = [0, 1, 2];
	for(type = 0; type < typesToUpdate.length; type++)
	{
		if(type == 2)
		{
			E("speed-result").innerHTML = (Math.round(speed * 100 * 2.237) / 100) + "mph, " + (Math.round(speed * 100 * 3.6) / 100) + "kph";
		}
		else// calculate correct time for given distance
		{
			var lengthMeters = getLength(type);
			var newTimeStr = formatTimeString(round(lengthMeters / speed));
			if(type == source)// don't update an input which called this function in the first place, as it may lead to recursion
			{
				lintTimeInput(types[type] + "-time");
			}
			else
			{
				E(types[type] + "-time").value = newTimeStr;
			}
			E(types[type] + "-result").innerHTML = newTimeStr;
		}
	}
	updateSplitResults();
	E("mile-time-result").innerHTML = formatTimeString(round(unitsLength.mi / speed));
}

function updateSplitResults()
{
	var splits = getLength(1) / getSpeed(0)// get split times
	var showAll = E("checkbutton-show-all-splits").checked;
	if(showAll)
	{
		var pos = 0;
		var i = 0;
		var strMatrix = [];
		var raceLen = getLength(0);
		var splitLen = getLength(1);
		// check if loop will be a reasonable length
		if(isUsableNumber(raceLen) && raceLen > 0 && isUsableNumber(splitLen) && splitLen > 0 && raceLen / splitLen < 100)
		{
			while(pos < raceLen + splitLen)// while current position is in the race
			{
				var currRow = [];
				if(pos > raceLen){pos = raceLen}
				// split #
				if(i == 0)
				{
					currRow.push("Start");
				}
				else
				{
					if(pos >= raceLen)
					{
						currRow.push("Finish");
					}
					else
					{
						currRow.push(i);
					}
				}
				// distance
				currRow.push(pos + "m")
				// time
				currRow.push(formatTimeString(round(pos / getSpeed(0))));
				pos += splitLen;
				i += 1;
				// new row
				strMatrix.push(currRow);
			}
			E("split-result").innerHTML = formatStringMatrix(strMatrix);
		}
		else
		{
			E("split-result").innerHTML = "Invalid\nresult";
		}
	}
	else
	{
		E("split-result").innerHTML = formatTimeString(round(splits));
	}
}

function lintTimeInput(id)// formats it correctly
{
	var elem = E(id);
	elem.value = formatTimeString(round(parseTimeString(elem.value)));
}


// ------------------------------- on load -------------------------------
window.onload = function(){
	update(0);
	centerBody();
}


// ------------------------------- read inputs -------------------------------
function getSpeed(type)
{
	if(type == 2)// currently unused
	{
		return E(types[type]).value;// the "speed" field is assumed to be meters/sec
	}
	else
	{
		return getLength(type) / getTime(type);// V = D/T
	}
}

function getLength(type)
{
	return unitConvertLength(
		E(types[type] + "-length").value,
		getSelectedOption(E(types[type] + "-units")),
		"m"
	);
}

function getTime(type)
{
	return parseTimeString(E(types[type] + "-time").value);
}

function getSelectedOption(elem)// gets value of currently selected option of <select> element
{
	return elem.options[elem.selectedIndex].value;
}


// ------------------------------- unit & string conversion -------------------------------
unitsLength = {
	m: 1,
	km: 1000,
	mi: 1609.344,
	marathon: 42195
};

function unitConvertLength(value, from, to)
{
	return (unitsLength[from] / unitsLength[to]) * value;
}

function round(value)
{
	var mult = Number(getSelectedOption(E("rounding")));
	return Math.round(value * mult) / mult;
}

// ------------------------------- MISC -------------------------------
types = ["race", "split", "speed"]
