function encode_rlc(input) {
    var encoding = [];
    var prev, count, i;
    for (count = 1, prev = input[0], i = 1; i < input.length; i++) {
        if (input[i] != prev) {
            encoding.push([count, prev]);
            count = 1;
            prev = input[i];
        }
        else 
            count ++;
    }
    encoding.push([count, prev]);
	document.getElementById("status_text").innerHTML = encoding;
    return encoding;
}
function decode_rlc(input) {
	var temp=[];
	var output="";
	input=input.replace(/,,/g,",`")
	temp=input.split(',');
	for(i=0;i<temp.length;i=i+2)
	{
		if(temp[i+1]=='`') temp[i+1]=',';
		output+=temp[i+1].repeat(temp[i]);
	}
    return output;
}

function compressLZW(uncompressed) {
	"use strict";
	// Build the dictionary.
	var i,
		dictionary = {},
		c,
		wc,
		w = "",
		result = [],
		dictSize = 256;
	for (i = 0; i < 256; i += 1) {
		dictionary[String.fromCharCode(i)] = i;
	}

	for (i = 0; i < uncompressed.length; i += 1) {
		c = uncompressed.charAt(i);
		wc = w + c;
		if (dictionary.hasOwnProperty(wc)) {
			w = wc;
		} else {
			result.push(dictionary[w]);
			dictionary[wc] = dictSize++;
			w = String(c);
		}
	}

	// Output the code for w.
	if (w !== "") {
		result.push(dictionary[w]);
	}
	return result;
}
function decompressLZW(input) {
	var temp=[];
	var compressed=[];
	temp=input.split(',');
	for(i=0;i<temp.length;i++)
	{
		compressed.push(temp[i])
	}
	// Build the dictionary.
	var i,
		dictionary = [],
		w,
		result,
		k,
		entry = "",
		dictSize = 256;
	for (i = 0; i < 256; i += 1) {
		dictionary[i] = String.fromCharCode(i);
	}

	w = String.fromCharCode(compressed[0]);
	result = w;
	for (i = 1; i < compressed.length; i += 1) {
		k = compressed[i];
		if (dictionary[k]) {
			entry = dictionary[k];
		} else {
			if (k === dictSize) {
				entry = w + w.charAt(0);
			}
		}

		result += entry;

		// Add w+entry[0] to the dictionary.
		dictionary[dictSize++] = w + entry.charAt(0);

		w = entry;
	}
	return result;
}

function HuffmanEncoding(str) {
    this.str = str;
	
    var count_chars = {};
    for (var i = 0; i < str.length; i++) 
        if (str[i] in count_chars) 
            count_chars[str[i]] ++;
        else 
            count_chars[str[i]] = 1;
    var pq = [];
    for (var ch in count_chars) 
        pq.push([count_chars[ch], ch]);
 
    while (pq.length > 1) {
        var pair1 = pq.pop();
        var pair2 = pq.pop();
        pq.push([pair1[0]+pair2[0], [pair1[1], pair2[1]]]);
    }
    var tree = pq.pop();
    this.encoding = {};
    this._generate_encoding(tree[1], "");
    this.encoded_string = ""
    for (var i = 0; i < this.str.length; i++) {
        this.encoded_string += this.encoding[str[i]];
    }
}
 
HuffmanEncoding.prototype._generate_encoding = function(ary, prefix) {
    if (ary instanceof Array) {
        this._generate_encoding(ary[0], prefix + "0");
        this._generate_encoding(ary[1], prefix + "1");
    }
    else {
        this.encoding[ary] = prefix;
    }
}
 
HuffmanEncoding.prototype.inspect_encoding = function() {
    var output=""
	for (var ch in this.encoding) {
        output+="'" + ch + "': " + this.encoding[ch] +"\n"
    }
	return output;
}
 
HuffmanEncoding.prototype.decode = function(encoded) {
    var rev_enc = {};
    for (var ch in this.encoding) 
        rev_enc[this.encoding[ch]] = ch;
 
    var decoded = "";
    var pos = 0;
    while (pos < encoded.length) {
        var key = ""
        while (!(key in rev_enc)) {
            key += encoded[pos];
            pos++;
        }
        decoded += rev_enc[key];
    }
    return decoded;
}


function docompress() {
	var input_text = document.getElementById("input_text").value
	if(document.getElementById('rlc').checked) {
		if(document.getElementById('compress_check').checked)
		{
			var output_text = encode_rlc(input_text)
			document.getElementById("output_text").innerHTML = output_text;
			document.getElementById("status_text").innerHTML = "Compress RLC.";
		}
		else if(document.getElementById('decompress_check').checked)
		{
			var output_text = decode_rlc(input_text)
			document.getElementById("output_text").innerHTML = output_text;
			document.getElementById("status_text").innerHTML = "Decompress RLC.";
		}
	}
	else if(document.getElementById('lzw').checked) {
		if(document.getElementById('compress_check').checked)
		{
			var output_text = compressLZW(input_text)
			document.getElementById("output_text").innerHTML = output_text;
			document.getElementById("status_text").innerHTML = "Compress LZW.";
		}
		else if(document.getElementById('decompress_check').checked)
		{
			var output_text = decompressLZW(input_text)
			document.getElementById("output_text").innerHTML = output_text;
			document.getElementById("status_text").innerHTML = "Decompress LZW.";
		}
	}
	else if(document.getElementById('huff').checked) 
	{
		if(document.getElementById('compress_check').checked)
		{		 			
			var huff = new HuffmanEncoding(input_text);
			var table = huff.inspect_encoding();
			var output_text = huff.encoded_string;
			document.getElementById("output_text").innerHTML = output_text +"\n\nHuffman table: \n"+table;
			document.getElementById("status_text").innerHTML = "Compress Huffman.";
		}
		else if(document.getElementById('decompress_check').checked)
		{
			document.getElementById("output_text").innerHTML = "Sorry, Huffman decompression in JS version is not available, please use Python version.";
			document.getElementById("status_text").innerHTML = "Sorry, Huffman decompression in JS version is not available, please use Python version.";
		}
	}	
}
function saveTextAsFile()
{
	var textToWrite = document.getElementById("output_text").value;
	var textFileAsBlob = new Blob([textToWrite], {type:'text/plain'});
	var fileNameToSaveAs = "abc";

	var downloadLink = document.createElement("a");
	downloadLink.download = fileNameToSaveAs;
	downloadLink.innerHTML = "Download File";
	if (window.webkitURL != null)
	{
		downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
	}
	else
	{
		downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
		downloadLink.onclick = destroyClickedElement;
		downloadLink.style.display = "none";
		document.body.appendChild(downloadLink);
	}

	downloadLink.click();
}

function destroyClickedElement(event)
{
	document.body.removeChild(event.target);
}
function loadfile()
{
  var reader;
  var progress = document.querySelector('.percent');

  function abortRead() {
	reader.abort();
  }

  function errorHandler(evt) {
	switch(evt.target.error.code) {
	  case evt.target.error.NOT_FOUND_ERR:
		alert('File Not Found!');
		break;
	  case evt.target.error.NOT_READABLE_ERR:
		alert('File is not readable');
		break;
	  case evt.target.error.ABORT_ERR:
		break; 
	  default:
		alert('An error occurred reading this file.');
	};
  }

  function updateProgress(evt) {
	if (evt.lengthComputable) {
	  var percentLoaded = Math.round((evt.loaded / evt.total) * 100);
	  // Increase the progress bar length.
	  if (percentLoaded < 100) {
		progress.style.width = percentLoaded + '%';
		progress.textContent = percentLoaded + '%';
	  }
	}
  }

  function handleFileSelect(evt) {
	// Reset progress indicator on new file selection.
	progress.style.width = '0%';
	progress.textContent = '0%';

	reader = new FileReader();
	reader.onerror = errorHandler;
	reader.onprogress = updateProgress;
	reader.onabort = function(e) {
	  alert('File read cancelled');
	};
	reader.onloadstart = function(e) {
	  document.getElementById('progress_bar').className = 'loading';
	};
	reader.onload = function(e) {
	  // Ensure that the progress bar displays 100% at the end.
	  progress.style.width = '100%';
	  progress.textContent = '100%';
	  setTimeout("document.getElementById('progress_bar').className='';", 2000);
	  // Outfile
	  var contents = e.target.result;
	  document.getElementById('input_text').innerHTML=contents;
	}

	// Read in the text file
	reader.readAsText(evt.target.files[0]);
	
  }

  document.getElementById('files').addEventListener('change', handleFileSelect, false);
}

