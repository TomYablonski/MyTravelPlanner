import  {handleSubmit} from "./formHandler";
const nextPicture = document.getElementById('nextPicture').addEventListener('click', function (e) {
     let cityPic = document.getElementById('cityPic');
     let cityPic2 = document.getElementById('cityPic2');
     let picNum = document.getElementById('picNum').value;
     let nextPicButton = document.getElementById('nextPicture');

	 if (picNum === '1'){
		 cityPic2.style.display = "block";
		 cityPic.style.display = "none";
		 cityPic3.style.display = "none";
		 document.getElementById('picNum').value = '2';	 
	 }
	 if (picNum === '2'){
		 cityPic3.style.display = "block";
		 cityPic.style.display = "none";
		 cityPic2.style.display = "none";
		 document.getElementById('picNum').value = '3';	 
		 nextPicButton.style.display = "none";
	 }
});
const resetTrip = document.getElementById('resetTrip').addEventListener('click', function (e) {
    document.getElementById('travelPlannerForm').reset();
    location.reload();
});

document.getElementById("submitButton").addEventListener("click", handleSubmit);

export {
 
    resetTrip,
}