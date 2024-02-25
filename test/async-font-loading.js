(function(){function insertFontFaceRule(inlineStyle){var head=document.head||document.getElementsByTagName("head")[0];var style=head.appendChild(document.createElement("style"));return style.appendChild(document.createTextNode("@font-face{"+inlineStyle+"}"))}function insertFontFaceDetector(inlineStyle,family,fallback){var inlineStyle=inlineStyle.concat(detectorStyle);var detectBlock=document.createElement("font-detection");detectBlock.appendChild(document.createTextNode(detectorText));inlineStyle[0]="font-family:"+fallback;detectBlock.setAttribute("style",inlineStyle.join(";"));document.body.appendChild(detectBlock);var returnValue={element:detectBlock,width:detectBlock.offsetWidth,height:detectBlock.offsetHeight};inlineStyle[0]="font-family:"+family+","+fallback;detectBlock.setAttribute("style",inlineStyle.join(";"));return returnValue}function loadFont(family,weight,style,src){var familyGenerated=family+Math.floor(Math.random()*99999999);var inlineStyle=["font-family:"+family,"font-style:"+style,"font-weight:"+weight];var styleText=insertFontFaceRule(inlineStyle.concat("src:"+src).join(";"));function onready(){if(document.readyState==="complete"){var detectors={monospace:insertFontFaceDetector(inlineStyle,family,"monospace"),sansserif:insertFontFaceDetector(inlineStyle,family,"sans-serif"),serif:insertFontFaceDetector(inlineStyle,family,"serif")};function timeout(){if(detectors.monospace.width===detectors.monospace.element.offsetWidth&&detectors.monospace.height===detectors.monospace.element.offsetHeight&&detectors.sansserif.width===detectors.sansserif.element.offsetWidth&&detectors.sansserif.height===detectors.sansserif.element.offsetHeight&&detectors.serif.width===detectors.serif.element.offsetWidth&&detectors.serif.height===detectors.serif.element.offsetHeight)setImmediate(timeout);else{document.body.removeChild(detectors.monospace.element);document.body.removeChild(detectors.sansserif.element);document.body.removeChild(detectors.serif.element);styleText.nodeValue=styleText.nodeValue.replace(familyGenerated,family)}}timeout()}else setImmediate(onready)}onready()}function loadFonts(fonts){var index=-1;while(font=fonts[++index]){loadFont(font.family,font.weight,font.style,font.src)}}var detectorStyle=["clip:rect(0 0 0 0)","overflow: hidden","position: absolute"];var detectorText="AxmTYklsjo190QW";var setImmediate=window.requestAnimationFrame||window.setTimeout;loadFonts([{"family":"Alice","weight":"400","style":"normal","src":"url(//fonts.gstatic.com/s/alice/v20/OpNCnoEEmtHa6GcArgo.eot?#) format(\"eot\"),url(//fonts.gstatic.com/s/alice/v20/OpNCnoEEmtHa6GcOrg4.woff2) format(\"woff2\"),url(//fonts.gstatic.com/s/alice/v20/OpNCnoEEmtHa6GcArgg.woff) format(\"woff\")"}])})()