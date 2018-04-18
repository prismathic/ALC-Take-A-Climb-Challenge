function newContact(id,name,number,email) {
	this.id = id;
	this.name = name;
	this.number = number;
	this.email = email;
};

var contacts = new Array();;

window.onload = init;

function init() {
	var submitButton = document.getElementById("addContact");
	submitButton.onclick = getFormData;
	getContacts();
};

function getContacts() {
	if(sessionStorage) {
		for(let i = 0; i<sessionStorage.length; i++) {
			var key = sessionStorage.key(i);
			if(key.substring(0,8) === "contact_") {
				var value = sessionStorage.getItem(key);
				var contact = JSON.parse(value);
				contacts.push(contact);
			}
		}
		showContacts();
	}
	else {
		alert('No storage medium available!');
	}
}

function showContacts() {
	var table = document.getElementById('main');
	var fragment = document.createDocumentFragment();
	for (let i = 0; i < contacts.length; i++) {
		var contact = contacts[i];
		var tr = createContact(contact);
		fragment.appendChild(tr);
	}
	table.appendChild(fragment);
}

function addContact(contact) {
	var table = document.getElementById('main')
	var tr = createContact(contact);
	table.appendChild(tr);
	document.forms[0].reset();
}



function createContact(contact) {
	var tr = document.createElement('tr');
	var td_one = document.createElement('td');
	var td_two = document.createElement('td');
	var ul = document.createElement('ul');
	var li_one = document.createElement('li');
	ul.appendChild(li_one);
	var li_two = document.createElement('li');
	ul.insertBefore(li_two,li_one.nextSibling);
	var btnName = document.createElement('span'), btnNumber = document.createElement('span'), btnEmail = document.createElement('span');
	btnEdit = document.createElement('span');
	btnView = document.createElement('span');
	btnDelete = document.createElement('span');
	// btnEdit.style.float = "right";
	btnEdit.setAttribute('class','fa fa-pencil edit');
	btnView.setAttribute('class', 'fa fa-angle-down view');
	btnDelete.setAttribute('class', 'fa fa-close delete');
	btnEdit.setAttribute('title', 'Edit Contact');
	btnView.setAttribute('title', 'View Contact');
	btnDelete.setAttribute('title', 'Delete Contact');
	btnView.innerHTML = "&nbsp;&nbsp;"
	btnEdit.innerHTML = "&nbsp;&nbsp;"	
	btnEdit.onclick = updateContact;
	btnDelete.onclick = deleteContact;
	btnView.onclick = viewContact;	
	btnView.setAttribute('id', 'view_' + contact.id);
	btnName.setAttribute('class','contact-name');
	btnNumber.setAttribute('class','contact-number');
	btnEmail.setAttribute('class','contact-email');
	btnName.innerHTML = contact.name;
	btnNumber.innerHTML = "<i class='fa fa-phone'></i>&nbsp;&nbsp; " + contact.number;
	btnEmail.innerHTML = "<i class='fa fa-envelope'></i>&nbsp;&nbsp;  <a href = \"mailto:" + contact.email + "\">" + contact.email + "</a>";
	li_one.appendChild(btnNumber);
	li_two.appendChild(btnEmail);

	ul.setAttribute('id', 'ul_' + contact.id);
	ul.style.display = 'none'
	td_one.appendChild(btnName);
	td_one.appendChild(ul);
	td_one.setAttribute('width', '320px');
	// spanName.onclick = toggleShow(contact.id);
		// ||
	td_two.appendChild(btnView);
	td_two.appendChild(btnEdit);
	td_two.appendChild(btnDelete);
	td_two.setAttribute('valign', 'top');
	
	tr.appendChild(td_one);
	tr.appendChild(td_two);
	tr.setAttribute('id', contact.id)

	return tr;
}







function getFormData(event) {
	let name = document.getElementById('name').value;
	let number = document.getElementById('num').value;
	let email = document.getElementById('email').value;
	var id = new Date().getTime();

	if (checkNum(number) && checkEmail(email)) {
		var contact = new newContact(id, name, number, email);
		contacts.push(contact);
		// document.write(contacts[3].name);
		addContact(contact);
		saveContact(contact);
		displayModal('added');	
	}
	else {
		event.preventDefault();
		alert('Contact Details not saved successfully. Please follow the guidelines given in the form')
	}
	
};


function saveContact(contact) {
	if (sessionStorage) {
		var key = 'contact_' + contact.id;
		var value = JSON.stringify(contact);
		sessionStorage.setItem(key, value);
	}
	else {
		alert('No storage medium available!');
	}

}
function updateContact(event) {
	var newName = document.getElementById('new_name');
	var newNumber = document.getElementById('new_num');
	var newEmail = document.getElementById('new_email');
	var updateBtn = document.getElementById('update');
	var right = document.getElementById('update_display');
	right.style.display = 'block';
	
	var td = event.target.parentElement;
	var tr = td.parentElement;
	var id = tr.id

	//Show the clicked button values on the contact form
	for(var i = 0; i<contacts.length; i++) {
		if(contacts[i].id == id) {
			newName.value = contacts[i].name;
			newNumber.value = contacts[i].number;
			newEmail.value =  contacts[i].email;
			break;
		}
	}

	
	updateBtn.onclick = function(event) {
		event.preventDefault();
		var nameUpd = document.getElementById('new_name').value;
		var numUpd = document.getElementById('new_num').value;
		var emailUpd = document.getElementById('new_email').value;

		if (checkNum(numUpd) && checkEmail(emailUpd)) {
			//Save changes made to the contacts array
			for (var i = 0; i < contacts.length; i++) {
				if (contacts[i].id == id) {
					contacts[i].name = nameUpd;
					contacts[i].number = numUpd;
					contacts[i].email = emailUpd;
					break;
				}
			}
			//Save changes made to sessionStorage
			var key = "contact_" + id;
			var name = nameUpd;
			var number = numUpd;
			var email = emailUpd;
			var value = new newContact(id, name, number, email);
			var valueJSON = JSON.stringify(value);
			sessionStorage.setItem(key, valueJSON);



			// Update page immediately
			var td_one = tr.children[0];
			var span = td_one.children[0];
			var ul = td_one.children[1];
			var li_one_span = ul.children[0].children[0];
			var li_two_span = ul.children[1].children[0];

			span.innerHTML = nameUpd;
			li_one_span.innerHTML = "<i class='fa fa-phone'></i> " + numUpd;
			li_two_span.innerHTML = "<i class='fa fa-envelope'></i> " + emailUpd;


			displayModal('updated');
		}
		else {
			alert('Error! Fill the form according to the instructions given.')
		}



		
			
	};
};

function deleteContact(event) {
	var td = event.target.parentElement;
	var tr = td.parentElement;
	var id = tr.id;
	

	var key = "contact_" + id;
	var value = sessionStorage.getItem(key);
	var valuePARSE = JSON.parse(value);

	//Send a confirmation message
	if (confirm('Are you sure you want to remove ' + valuePARSE.name + ' as a contact?')) {

		//Delete in sessionStorage
		sessionStorage.removeItem(key);

		//Splice from contacts array
		for (var i = 0; i < contacts.length; i++) {
			if (contacts[i].id == id) {
				contacts.splice(i,1);
				break;
			}
		}

		//Remove Item from page immediately
		var tbody = document.getElementById('main');
		tbody.removeChild(tr);

		displayModal('deleted');
		
	}
}

function viewContact(event) {
	var td = event.target.parentElement;
	var tr = td.parentElement;
	var id = tr.id;
	var viewBtn = document.getElementById('view_' + id);
	var list = document.getElementById('ul_' + id);

	if(list.style.display == 'none') {
		list.style.display = 'block';
		viewBtn.classList.remove('fa-angle-down');
		viewBtn.classList.add('fa-angle-up');
	}
	else {
		list.style.display = 'none';
		viewBtn.classList.remove('fa-angle-up');
		viewBtn.classList.add('fa-angle-down');
	}

}

function displayModal(message) {
	var modal = document.getElementById('display_modal');
	var close = document.getElementById('close');
	var content = document.getElementById('content');
	var p = content.children[1];


	modal.style.display = 'block';

	if (message == 'added') {
		p.innerHTML = "Contact was successfully added!";
	} 
	
	else if (message == 'deleted') {
		p.innerHTML = "Contact was successfully deleted!"
	}
	else if (message == 'updated') {
		p.innerHTML = "Contact was successfully updated!"
	}

	close.onclick = function() {
		modal.style.display = 'none';
		document.forms[1].reset();
		var right = document.getElementById('update_display');
		right.style.display = 'none';

	}

}

//Verify if phone number is a standard Nigerian number....
function checkNum(num) {
	var infoText = document.getElementsByClassName('infoText')[0];
	var spanOne = document.getElementsByClassName('errorText')[0];
	var spanTwo = document.getElementsByClassName('errorText')[1];
	var spanThree = document.getElementsByClassName('errorText')[2];
	var numInput = document.getElementById('num');

	if (isNaN(num)) {
		infoText.style.display = 'none';
		spanTwo.style.display = 'block';
		numInput.style.borderColor = 'red';

		return false;
	}
	else if (num.length < 11 && num.length >= 1) {
		spanOne.style.display = 'block';
		infoText.style.display = 'none';
		numInput.style.borderColor = 'red';

		return false;
	}
	else if (num == null || num == '') {
		spanThree.style.display = 'block';
		infoText.style.display = 'none';
		numInput.style.borderColor = 'red';

		return false;
	}
	else {
		return true;
	}

}
//Email valiidation
function checkEmail(email) {
	var infoText = document.getElementsByClassName('infoText')[0];
	var spanOne = document.getElementsByClassName('errorText')[0];
	var spanTwo = document.getElementsByClassName('errorText')[1];
	var spanThree = document.getElementsByClassName('errorText')[2];
	var spanFour = document.getElementsByClassName('errorText')[3];

	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	if (re.test(email) == false) {
		infoText.style.display = 'none';
		spanFour.style.display = 'block';

		return false;
	}
	else {
		return true;
	}

}













// const form = document.getElementById('contact_form')

// 		form.addEventListener('submit', function() {
// 			event.preventDefault();

// 			let name = document.getElementById('contact_name').value;
// 			let number = document.getElementById('contact_number').value;
// 			addName(name,number);
// 		});


// 		function addName(name, number) {
// 			var contact = [	{name:"Tomiwa", number: "020",email:"tomiwa@gmail.com"},
// 						{name:"Toluwani", number: "060",,email:"toluwani@gmail.com"},
// 						{name:"Ayodeji", number: "090",,email:"ayodeji@gmail.com"},
// 						];
// 			contact.push({name: name, number: number});
// 		};

// 		contact.forEach(function(value){
// 			document.write(value.name + "'s number is: " + value.number)
// 			})
// 		