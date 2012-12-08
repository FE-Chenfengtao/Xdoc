var methodName = "foo";
var isMemberMethod = true;
var returnType = "void";
var argumentArray = [];
var argumentTypes = [];
var labelArray = [];
var returnTypesSupported = [ "void", "id", "NSArray", "NSString",  "NSUInteger" ];
var argTypesSupported = [ "id", "NSArray", "NSString",  "NSUInteger" ];

function updateMethodSource() {
	var methodSource = (isMemberMethod ? "-" : "+");
	methodSource += "("+returnType+")"+methodName;
	var tbodyArgs = $("tbody", $("#argTable"));
	var firstLabel = "";
	if (labelArray.length > 1) {
		firstLabel = labelArray[1];
	}
	var argCount = argumentArray.length;
	for (i=0; i < argCount; i++) {
		methodSource += labelArray[i+1] + ":(" + argumentTypes[i] + ")" + argumentArray[i] + " ";
	}
	if (argCount > 0) {
		methodSource = methodSource.substring(0, methodSource.length-1);
	}
	console.log("Updating method source: " + methodSource + " method name:"+methodName+firstLabel);
	$("#fctSource").attr("value", methodSource);
	$("#fctName").attr("value", methodName+firstLabel);
}

function removeArguments() {
	console.log("remove all arguments");
	var tbodyArgs = $("tbody", $("#argTable"));
	$(".Arg", tbodyArgs).each(function() { 
		$(this).remove();
	});

	argumentTypes = [];
	argumentArray = [];
	labelArray = [];
}

function returnTypeSupported(returnType) {
	for (i=0; i < returnTypesSupported.length; i++) {
		if (returnType == returnTypesSupported[i]) {
			return true;
		}
	}
	return false;
}

function argTypeSupported(argType) {
	for (i=0; i < argTypesSupported.length; i++) {
		if (argType == argTypesSupported[i]) {
			return true;
		}
	}
	return false;
}

function updateFromParsingCode() {
	console.log("updateFromParsingCode");
	if (isMemberMethod) {
		$("#instance").attr("selected", "selected");
	} else {
		$("#class").attr("selected", "selected");
	}
	var cleanedReturnType = cleanTypeFromPointer(returnType);
	if (returnTypeSupported(cleanedReturnType)) {
		console.log("return type supported: " + cleanedReturnType);
		$("#"+cleanedReturnType).attr("selected", "selected");
	} else {
		console.log("return type not supported("+returnType+"): choosing other");
		$("#other").attr("selected","selected");
		$("#returnedType").attr("value", returnType);
	}
	$("#fctName").attr("value", methodName);
	var ArgCount = argumentArray.length;
	var tbodyArgs = $("tbody", $("#argTable"));
	if (ArgCount > 0) $("#RemoveArgs").show();
	for (iterArg=0; iterArg < ArgCount; iterArg++) {
		var indexArgTable = iterArg + 1;
	    addParameter("arg");
	    var cleanedArgType = cleanTypeFromPointer(argumentTypes[iterArg]);
	    console.log(iterArg+":"+cleanedArgType+"(" + argumentTypes[iterArg] +")" + argumentArray[iterArg]);
	    if (argTypeSupported(cleanedArgType)) {
	    	console.log(iterArg+":argument type supported: " + cleanedArgType);
	    	$("#arg"+ cleanedArgType, $("tr", tbodyArgs).eq(indexArgTable)).attr("selected", "selected");
	    } else {
	    	console.log(iterArg+":argument type not supported("+argumentTypes[iterArg]+"): choosing other");
	    	$("#argOther", $("tr", tbodyArgs).eq(indexArgTable)).attr("selected","selected");
	    	$("#argTypeCustom", $("tr", tbodyArgs).eq(indexArgTable)).attr("value", argumentTypes[iterArg]);
	    }
	    $("#argName", $("tr", tbodyArgs).eq(indexArgTable)).attr("value", argumentArray[iterArg]);
	    if (labelArray[iterArg].length > 0) {
	    	$("#argLabel", $("tr", tbodyArgs).eq(indexArgTable)).attr("value", labelArray[iterArg]);
	    }
	}
	updateSnippet();
}

function updateHeaderDocs(type) {
	console.log("updateHeaderDocs");
	var multiLine = $("#script").attr("checked");
	var output; if (multiLine) { output = "/*! <br/><br/>" } else { output = "# /*! <br/>#<br/># "; }
	
	if (type == "method") {
		var testLabel = $("#argLabel", $("tr", $("tbody", $("#argTable"))).eq(1)).attr("value");
		output += "@method " + $("#fctName").attr("value") + ((testLabel!==undefined) ? (testLabel) : " " );
		var i;
		var tbodyArgs = $("tbody", $("#argTable"));
		var nbItems = tbodyArgs[0].childElementCount;
		for (i=1; i < nbItems; i++) {
			var currentLabel = "";
			if (i > 1) {
				var currentRow = $("tr", tbodyArgs).eq(i);
				currentLabel = $("#argLabel", currentRow).attr("value");
			}
			output += currentLabel + ":";
		}
	} else if (type == "class") {
		output += "@class " + $("#className").val();
	} else if (type == "protocol") {
		output += "@protocol " + $("#protocolName").val();
	}
	
	output += "<br/>"; if (!multiLine) { output += "# "; }
	
	if ($("#addDiscussion").attr("checked")) {
		output += "@discussion " + $("#funcDesc").attr("value") + "<br/>"; if (!multiLine) { output += "# "; }
	}
	if ($("#addAbstract").attr("checked")) {
		output += "@abstract " + $("input[name='abstract']").attr("value") + "<br/>"; if (!multiLine) { output += "# "; }
	}
	
	if (type == "method") {
		var i;
		var tbodyArgs = $("tbody", $("#argTable"));
		var nbItems = (tbodyArgs[0].childElementCount!==undefined) ? tbodyArgs[0].childElementCount : 0;
		for (i=1; i < nbItems; i++) {
			var currentRow = $("tr", tbodyArgs).eq(i);
			output += "@param ";
			output += $("#argName", currentRow).attr("value") + " ";
			output += $("#argDesc", currentRow).attr("value") + "<br/>"; if (!multiLine) { output += "# "; }
		}
	
		var tbodyExcs = $("tbody", $("#excTable"));
		var nbItems = tbodyExcs[0].childElementCount;
		for (i=1; i < nbItems; i++) {
			var currentRow = $("tr", tbodyExcs).eq(i);
			output += "@throw ";
			output += $("#excName", currentRow).attr("value") + " ";
			output += $("#excDesc", currentRow).attr("value") + "<br/>"; if (!multiLine) { output += "# "; }
		}
		
	    if ($("#return").attr("value") == "other") {
	        output += "@result " + $("#returnedType").attr("value") + "<br/>"; if (!multiLine) { output += "# "; }
	    } else if ($("#return").attr("value") != "void") {
	        output += "@result " + $("#return").attr("value") + "<br/>"; if (!multiLine) { output += "# "; }
	    }
    }
    
	if (multiLine) { output += "<br/>*/"; } else { output += "<br/># */"; }
	return output;
}

function updateCode(type)
{
	var language = $("input[name=language]:checked").val();
	return (language == "ObjC" ? updateObjCCode(type):updateCppCode(type));
}

function updateObjCCode(type) {
	console.log("updateObjCCode");
	var output = "";
	if (type == "method") {
		argumentTypes = [];
		argumentArray = [];
		labelArray = [];
		
		var typeMethod = $("#type option:selected").text();
		(typeMethod == "-") ? isMemberMethod = true : isMemberMethod = false;
		returnType = $("#return").attr("value");
		if (returnType == "other") {
			returnType = $("#returnedType").attr("value");
		}
		methodName = $("#fctName").attr("value");
	    output += typeMethod + " (" + returnType + ")" + methodName;
		
		/* Arguments */
		var i;
		var tbodyArgs = $("tbody", $("#argTable"));
		var nbItems = tbodyArgs[0].childElementCount;
		labelArray.push("");
		for (i=1; i < nbItems; i++) {
			var currentRow = $("tr", tbodyArgs).eq(i);
			labelArray[i] = $("#argLabel", currentRow).attr("value");
			
			output += $("#argLabel", currentRow).attr("value");
			var argType = $("#argType", currentRow).attr("value");
			if (argType == "other") {
				output += ":(" + $("#argTypeCustom", currentRow).attr("value") + ")";
				argumentTypes[i-1] = $("#argTypeCustom", currentRow).attr("value");
			} else {
				output += ":(" + $("#argType", currentRow).attr("value") + ")";
				argumentTypes[i-1] = $("#argType", currentRow).attr("value");
			}
			output += $("#argName", currentRow).attr("value");
			argumentArray[i-1] = $("#argName", currentRow).attr("value");
			output += " ";
		}
		
		$("div.definition").html((nbItems>1?output.substring(0, output.length - 1):output) + ";<br/><br/>");
		
		output += "<br/>{";
	
		/* Exceptions */
		var i;
		var tbodyExcs = $("tbody", $("#excTable"));
		var nbItems = tbodyExcs[0].childElementCount;
		if (nbItems > 1) {
			output += "<br/>&nbsp;@try { <br/>&nbsp;}";
		}
		for (i=1; i < nbItems; i++) {
			var currentRow = $("tr", tbodyExcs).eq(i);
			output += "&nbsp;@catch (";
			var excType = $("#excType", currentRow).attr("value");
			if (excType == "other") {
				output += $("#excTypeCustom", currentRow).attr("value") + " *";
			} else {
				output += $("#excType", currentRow).attr("value") + " *";
			}
			output += $("#excName", currentRow).attr("value");
			output += ") {<br/>&nbsp;}";
		}
		switch ($("#returnedType").attr("value")) {
			case "void": break;
			case "NSUInteger": output += "<br/>&nbsp;return 0;"; break;
			default: output += "<br/>&nbsp;return nil;"; break;
		}
		output += "<br/>}<br/><br/>";
	} else if (type == "class") {
		$("div.definition").html("@interface " + $("#className").val() + " : " + $("#parentClass").val()+"<br/><br/>@end<br/><br/>");
		output += "@implementation " + $("#className").val();
		output += "<br/><br/>@end<br/><br/>";
	} else if (type == "protocol") {
		$("div.definition").html("@protocol " + $("#protocolName").val() + "<br/><br/>@end<br/><br/>");
		output = "";
	}
	
    return output;
}

function updateCppCode(type) {
	console.log("updateCppCode");
	var output = "";
	if (type == "method") {
	    output += $("#returnedType").attr("value") + " " + $("#fctName").attr("value") + "(";
		
		/* Arguments */
		var i;
		var tbodyArgs = $("tbody", $("#argTable"));
		var nbItems = tbodyArgs[0].childElementCount;
		for (i=1; i < nbItems; i++) {
			var currentRow = $("tr", tbodyArgs).eq(i);
			var argType = $("#argType", currentRow).attr("value");
			if (argType == "other") {
				output += $("#argTypeCustom", currentRow).attr("value") + " ";
			} else {
				output += $("#argType", currentRow).attr("value") + " ";
			}
			output += $("#argName", currentRow).attr("value");
			output += ", ";
		}
		
		output = (nbItems>1?output.substring(0, output.length - 2):output);
		
		$("div.definition").html(output + ");<br/><br/>");
		
		output += ")<br/>{";
		output += "<br/>}<br/><br/>";
	} else if (type == "class") {
		$("div.definition").html("class " + $("#className").val() + " : public " + $("#parentClass").val()+" { <br/><br/>}<br/><br/>");
	}
	
	return output;
}

function updateSnippet() {
	console.log("updateSnippet with type: " + $("#inputType option:selected").attr("value"));
	$("div.definition").html("");
	$("div.comments").html(updateHeaderDocs($("#inputType option:selected").attr("value")));
	$("div.code").html(updateCode($("#inputType option:selected").attr("value")));
}

function addParameter(prefix) {
	var className = prefix.substring(0,1).toUpperCase() + prefix.substring(1,prefix.length);
	var tbody = $("tbody", $("#"+prefix+"Table"));
	var newRow = $("."+className+"Template", tbody).clone().appendTo(tbody)
	.removeClass(className+"Template")
	.addClass(className)
	.show();
}

function cleanTypeFromPointer(strType) {
	if (strType.charAt(strType.length-1) == "*") {
		strType = strType.replace(/ /, "");
		return strType.substring(0, strType.length-1);
	}
	return strType;
}

function parseObjC(value) {
	removeArguments();
    isMemberMethod = ((value.search("-") >= 0) ? true : false);
    indexOfLeftParenthesis = value.search('\\(');
    indexOfRightParenthesis = value.search('\\)');
    returnType = value.substring(indexOfLeftParenthesis+1, indexOfRightParenthesis);
    var firstArg = value.search(":");
    if (firstArg == -1) {
        methodName = value.substring(indexOfRightParenthesis+1);
    } else {
        methodName = value.substring(indexOfRightParenthesis+1, firstArg);
        var argTypes = value.substring(firstArg+1);
        labelArray.push("");
        var iterArg = 0;
        var stop = false;
        while (!stop) {
            indexOfRightParenthesis = argTypes.search('\\)');
            var nextArg = argTypes.search(':');
            argumentTypes[iterArg] = argTypes.substring(1, indexOfRightParenthesis);
            if (nextArg != -1) {
                var tmp = argTypes.substring(indexOfRightParenthesis+1, nextArg);
                var label = tmp.search(/ /);
                if (label != -1 && label < tmp.length - 1) {
                    argumentArray[iterArg] = tmp.substring(0, label);
                    labelArray.push(tmp.substring(label+1, nextArg));
                } else {
                    labelArray.push("none");
                    argumentArray[iterArg] = argTypes.substring(indexOfRightParenthesis+1, nextArg);

                } 
                argTypes = argTypes.substring(nextArg+1);
               iterArg++;
            } else {
                argumentArray[iterArg] = argTypes.substring(indexOfRightParenthesis+1);
                stop = true;
            }
        }
    }
	updateFromParsingCode();
}

function main() {

$(".hideMe").hide();
$("#returnedType").attr("value", $("#return").attr("value"));

$(".ArgTemplate").hide();
$(".ExcTemplate").hide();

$("#RemoveArgs").hide();

$(".DeleteArg").live("click", function(event){
	$(this).closest("tr").remove();
	updateSnippet();
	updateMethodSource();
});

$("#argType").live("change", function() {
	if ($(this).attr("value") == "other") {
		$("input[id='argTypeCustom']").show();
	} else {
		$("input[id='argTypeCustom']").hide();
	}
	updateSnippet();
	updateMethodSource();
});

$("#argTypeCustom").live("change", function() {
     updateSnippet();
     updateMethodSource();
     });

$(".DeleteExc").live("click", function(event){
	$(this).closest("tr").remove();
	updateSnippet();
});

$("#excType").live("change", function() {
	if ($(this).attr("value") == "other") {
		$("input[id='excTypeCustom']").show();
	} else {
		$("input[id='excTypeCustom']").hide();
	}
	updateSnippet();
});

$("#return").change(function() {
	$("#returnedType").attr("value", $(this).attr("value"));
	if ($(this).attr("value") == "other") {
		$("#returnedType").attr("value", "");
		$("input[id='returnedType']").show();
	} else {
		$("input[id='returnedType']").hide();
	}
	updateSnippet();
	updateMethodSource();
});

$("#type").change(function() {
	updateSnippet();
	updateMethodSource();
});

$("#addDiscussion").change(function() {
	if ($(this).attr("checked")) {
		$("#funcDesc").removeAttr("disabled");
		$("#funcDesc").attr("value","Enter discussion here");
	} else {
		$("#funcDesc").attr("disabled", "disabled");
		$("#funcDesc").attr("value","");
	}
});

$("#addAbstract").change(function() {
	if ($(this).attr("checked")) {
		$("input[name='abstract']").removeAttr("disabled");
		$("input[name='abstract']").attr("value","Enter abstract here");
	} else {
		$("input[name='abstract']").attr("disabled", "disabled");
		$("input[name='abstract']").attr("value","");
	}
});

$("li[type=Button]").hover( function() {
		var oldClass = $(this).attr("class");
		var newClass = oldClass.substring(0, oldClass.length-3) + "ovr";
		$(this).removeClass(oldClass);
		$(this).addClass(newClass);
	}, 
	function() {
		var oldClass = $(this).attr("class");
		var newClass = oldClass.substring(0, oldClass.length-3) + "btn";
		$(this).removeClass(oldClass);
		$(this).addClass(newClass);
	}
);

$("li[type=Button]").mousedown( function() {
	var oldClass = $(this).attr("class");
	var newClass = oldClass.substring(0, oldClass.length-3) + "dwn";
	$(this).removeClass(oldClass);
	$(this).addClass(newClass);	
});

$("li[type=Button]").mouseup( function() {
	var oldClass = $(this).attr("class");
	var newClass = oldClass.substring(0, oldClass.length-3) + "ovr";
	$(this).removeClass(oldClass);
	$(this).addClass(newClass);
	addParameter($(this).attr("id"));
	updateSnippet();
	updateMethodSource();
	if (argumentArray.length > 0) {
		$("#RemoveArgs").show();
	}
});

$("input").live("change", function() {
	if ($(this).attr("id") == "fctSource") {
		parseObjC($(this).attr("value"));
	} else {
		updateSnippet();
		updateMethodSource();
	}
	var tbodyArgs = $("tbody", $("#argTable"));
	if ($(this).attr("id") == "argLabel" && $(this).parent().parent().is($("tr", tbodyArgs).eq(1))) {
		console.log("label: " + $(this).attr("value"));
		$(this).attr("value","");
	}
});

$("#RemoveArgs").click(function() {
	removeArguments();
	updateSnippet();
	updateMethodSource();
	$(this).hide();
});

$("#inputType").change(function () {
	var templateClass = $("#inputType option:selected").attr("value") + "Template";
	var target = $("#" + templateClass);
	target.removeClass("hideMe");
	target.show();
	$("#inputType option:not(:selected)").each(function () {
		var templateClassToHide = $(this).attr("value") + "Template";
		var target = $("#" + templateClassToHide);
		target.addClass("hideMe");
		target.hide();
	});
	updateSnippet();
});

$("input[name=language]").change(function () {
	if ($(this).attr("value") == "ObjC") {
		$("#alternative").show();
		$("#methodPaste").show();
	} else {
		$("#alternative").hide();
		$("#methodPaste").hide();
	}
});

updateSnippet();

}