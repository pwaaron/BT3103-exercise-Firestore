const cafeList = document.querySelector('#cafe-list');
const form = document.querySelector('#add-cafe-form');
const name = document.getElementById('name');
const city = document.getElementById('city');
var orderby = 'none';

// create element & render cafe
function renderCafe(doc){
    let li = document.createElement('li');
    let name = document.createElement('span');
    let city = document.createElement('span');
    let cross = document.createElement('div');

    li.setAttribute('data-id', doc.id);
    name.textContent = doc.data().name;
    city.textContent = doc.data().city;
    cross.textContent = 'x';

    li.appendChild(name);
    li.appendChild(city);
    li.appendChild(cross);

    cafeList.appendChild(li);

    // deleting data
    cross.addEventListener('click', (e) => {
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute('data-id');
        db.collection('cafes').doc(id).delete();
    });
}

name.addEventListener('click', (e) => {
    e.preventDefault();
    orderby = 'name';
    run();
});

city.addEventListener('click', (e) => {
    e.preventDefault();
    orderby = 'city';
    run();
});

// saving data
form.addEventListener('submit', (e) => {
    e.preventDefault();
    db.collection('cafes').add({
        name: form.name.value,
        city: form.city.value
    });
    form.name.value = '';
    form.city.value = '';
    run();
});



// real-time listener
function run(){
    while (cafeList.lastElementChild) {
        cafeList.removeChild(cafeList.lastElementChild);
    }
    if (orderby == 'none'){
        db.collection('cafes').onSnapshot(snapshot => {
            let changes = snapshot.docChanges();
            changes.forEach(change => {
                console.log(change.doc.data());
                if(change.type == 'added'){
                    renderCafe(change.doc);
                } else if (change.type == 'removed'){
                    let li = cafeList.querySelector('[data-id=' + change.doc.id + ']');
                    cafeList.removeChild(li);
                }
            });
        });
    }
    else{
        db.collection('cafes').orderBy(orderby).onSnapshot(snapshot => {
            let changes = snapshot.docChanges();
            changes.forEach(change => {
                console.log(change.doc.data());
                if(change.type == 'added'){
                    renderCafe(change.doc);
                } else if (change.type == 'removed'){
                    let li = cafeList.querySelector('[data-id=' + change.doc.id + ']');
                    cafeList.removeChild(li);
                }
            });
        });
}
}

run();