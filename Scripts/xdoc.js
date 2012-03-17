
function updateHeaderDocs() {
	var multiLine = $("#script").attr("checked");
	var output; if (multiLine) { output = "/*! <br/><br/>" } else { output = "# /*! <br/>#<br/># "; }
	var testLabel = $("#argLabel", $("tr", $("tbody", $("#argTable"))).eq(1)).attr("value");
	output += "@method " + $("#fctName").attr("value") + ((testLabel!==undefined) ? (testLabel) : "" ) + "<br/>"; if (!multiLine) { output += "# "; }
	if ($("#addDiscussion").attr("checked")) {
		output += "@discussion " + $("#funcDesc").attr("value") + "<br/>"; if (!multiLine) { output += "# "; }
	}
	if ($("#addAbstract").attr("checked")) {
		output += "@abstract " + $("input[name='abstract']").attr("value") + "<br/>"; if (!multiLine) { output += "# "; }
	}
	var i;
	var tbodyArgs = $("tbody", $("#argTable"));
	var nbItems = tbodyArgs[0].childElementCount;
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
	
    if ($("#returnedType").attr("value") != "void" ) {
        output += "@result " + $("#returnedType").attr("value") + "<br/>"; if (!multiLine) { output += "# "; }
    }
	if (multiLine) { output += "<br/>*/"; } else { output += "<br/># */"; }
	$("div.comments").html(output);
}

function updateCode()
{
	var language = $("input[name=language]:checked").val();
	return (language == "ObjC" ? updateObjCCode():updateCppCode());
}

function updateObjCCode() {
    var output = $("#type option:selected").text() + " (" + $("#returnedType").attr("value") + ")" + $("#fctName").attr("value");
	
	/* Arguments */
	var i;
	var tbodyArgs = $("tbody", $("#argTable"));
	var nbItems = tbodyArgs[0].childElementCount;
	for (i=1; i < nbItems; i++) {
		var currentRow = $("tr", tbodyArgs).eq(i);
		output += $("#argLabel", currentRow).attr("value");
		var argType = $("#argType", currentRow).attr("value");
		if (argType == "other") {
			output += ":(" + $("#argTypeCustom", currentRow).attr("value") + ")";
		} else {
			output += ":(" + $("#argType", currentRow).attr("value") + ")";
		}
		output += $("#argName", currentRow).attr("value");
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

    return output;
}

function updateCppCode() {
    var output = $("#returnedType").attr("value") + " " + $("#fctName").attr("value") + "(";
	
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
	
	return output;
}

function updateSnippet() {
	updateHeaderDocs();
	$("div.code").html(updateCode());
}

function addParameter(prefix) {
	var className = prefix.substring(0,1).toUpperCase() + prefix.substring(1,prefix.length);
	var tbody = $("tbody", $("#"+prefix+"Table"));
	var newRow = $("."+className+"Template", tbody).clone().appendTo(tbody)
	.removeClass(className+"Template")
	.addClass(className)
	.show();
}

function main() {

$(".hideMe").hide();
$("#returnedType").attr("value", $("#return").attr("value"));

$(".ArgTemplate").hide();
$(".ExcTemplate").hide();

$(".DeleteArg").live("click", function(event){
	$(this).closest("tr").remove();
	updateSnippet();
});

$("#argName").live("change", function () {
	updateSnippet();
});

$("#argType").live("change", function () {
	updateSnippet();
});

$("#argLabel").live("change", function () {
	updateSnippet();
});

$("#argType").live("change", function() {
	if ($(this).attr("value") == "other") {
		$("input[id='argTypeCustom']").show();
	} else {
		$("input[id='argTypeCustom']").hide();
	}
	updateSnippet();
});

$("#argTypeCustom").live("change", function() {
     updateSnippet();
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
});

$("#type").change(function() {
	updateSnippet();
});

$("#addDiscussion").change(function() {
	if ($(this).attr("checked")) {
		$("#funcDesc").attr("disabled", "");
		$("#funcDesc").attr("value","Enter discussion here");
	} else {
		$("#funcDesc").attr("disabled", "disabled");
		$("#funcDesc").attr("value","");
	}
});

$("#addAbstract").change(function() {
	if ($(this).attr("checked")) {
		$("input[name='abstract']").attr("disabled", "");
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
	
	addParameter($(this).attr("id"));
	
	updateSnippet();
});

$("li[type=Button]").mouseup( function() {
	var oldClass = $(this).attr("class");
	var newClass = oldClass.substring(0, oldClass.length-3) + "ovr";
	$(this).removeClass(oldClass);
	$(this).addClass(newClass);
});

$("input").live("change", function() {
    updateSnippet();
});

updateSnippet();
}