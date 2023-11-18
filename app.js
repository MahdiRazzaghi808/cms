const cityData = {};
let osData = [];
let osName = ''
const BASEURL = 'https://asnaf-lms.iran.liara.run'
////////////////////////////////////////////////////////
function myFunction() {
    var selectElement = document.getElementById("oss");
    var selectedValue = selectElement.value;
    getCites(selectedValue);
    osName = selectedValue;
}


function changeCourses() {
    cityCoursesHandler()
}

///////////////////////////////////////////////////////////////////
const getCites = async (os) => {
    const res = await fetch(`${BASEURL}/${os}`);
    const result = await res.json();
    setCites(result, '#cites');
    osData = [...result];
    cityCoursesHandler()
}
const getCourses = async () => {
    const res = await fetch(`${BASEURL}/main`);
    const result = await res.json();
    setCourses(result)
}
/////////////////////////////////////////////////////////////////////////////////////
const setCites = (data, selector) => {
    const cit = document.querySelector(selector);
    cit.innerHTML = '';
    let text = ''

    data.forEach(element => {
        text += `<option value="${element.id}">${element.city}</option>`
    });
    cit.innerHTML = text
}


const setCourses = (data) => {
    const coursesWrapper = document.querySelectorAll('#courses-wrapper');
    coursesWrapper.forEach(v => {
        v.innerHTML = '';
        let text = `<option value="" disabled selected>دوره ها</option>`

        data.forEach(element => {
            text += `<option value="${element.en}">${element.fa}</option>`
        });
        v.innerHTML = text
    })
}
//////////////////////////////////////////////////////////////////////////////////////

const sendCourses = document.querySelector('#send-courses');
sendCourses.addEventListener('click', async () => {
    const enCourses = document.querySelector('#en');
    const faCourses = document.querySelector('#fa');

    if (faCourses.value === '') {
        iziToast.warning({
            position: 'topRight',
            message: 'لطفا اسم دوره فارسی را وارد کنید'

        })
    } else if (enCourses.value === '') {
        iziToast.warning({
            position: 'topRight',
            message: 'لطفا یک اسم انگلیسی برای دوره انتخاب کنید',
        })
    } else {
        Swal.fire({
            title: "آیا از ثبت دوره مطمین هستید ؟",
            showDenyButton: true,
            confirmButtonText: "تایید",
            denyButtonText: `لغو`
        }).then(async (result) => {
            if (result.isConfirmed) {

                const res = await fetch(`${BASEURL}/data`, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ en: enCourses.value, fa: faCourses.value })
                });
                if (res.status < 300) {
                    getCourses();
                    enCourses.value = ''
                    faCourses.value = '';
                    iziToast.success({
                        position: 'topRight',
                        message: 'دوره با موفقیت ثبت شد :)'
                    })
                } else {
                    iziToast.error({
                        position: 'topRight',
                        message: 'دوره مورد نظر ثبت نشد:('
                    })
                }

            }
        });


    }



})




window.addEventListener('load', () => {
    getCourses()
})



//////////////////////////////////////////////////////////////////////////////////////
const sendCity = document.querySelector('#send-city');

sendCity.addEventListener('click', async () => {
    const cityOs = document.querySelector('#city-os');
    const cityInput = document.querySelector('#city-input');



    if (cityOs.value === '') {
        iziToast.warning({
            position: 'topRight',
            message: 'لطفا استان را انتخاب کنید'

        })
    } else if (cityInput.value === '') {
        iziToast.warning({
            position: 'topRight',
            message: 'لطفا نام شهر مورد نظر را وارد کنید'

        })

    } else {
        Swal.fire({
            title: "آیا از ثبت شهر مطمین هستید ؟",
            showDenyButton: true,
            confirmButtonText: "تایید",
            denyButtonText: `لغو`
        }).then(async (result) => {
            if (result.isConfirmed) {

                const res = await fetch(`${BASEURL}/main`);
                const result = await res.json();
                const obj = { city: cityInput.value }

                result.forEach(v => {
                    obj[v.en] = ''
                })


                const res1 = await fetch(`${BASEURL}/${cityOs.value}`, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(obj)
                });

                if (res1.status < 300) {
                    cityInput.value = '';
                    cityOs.value = '';

                    iziToast.success({
                        position: 'topRight',
                        message: 'شهر مورد نظر با موفقیت ثبت شد :)'
                    })
                } else {
                    iziToast.error({
                        position: 'topRight',
                        message: 'شهر مورد نظر ثبت نشد :)'
                    })
                }
            }
        });

    }

})
//////////////////////////////////////////////////////////////////////////////////////////
function cityCoursesHandler() {
    const coursesWrapper = document.getElementById("courses-wrapper");
    const cites = document.getElementById("cites");
    const dataInput = document.getElementById("data-input");
    if (osData.length) {
        dataInput.value = osData[cites.value - 1][coursesWrapper.value] || ""
    }
}

const sendData = document.querySelector('#send-data');
sendData.addEventListener('click', () => {
    const selectElement = document.getElementById("cites");
    const dataInput = document.getElementById("data-input");
    const coursesWrapper = document.getElementById("courses-wrapper");
    if (coursesWrapper.value === '') {
        iziToast.warning({
            position: 'topRight',
            message: 'لطفا دوره مورد نظر را انتخاب کنید'
        })
    } else if (osName === '') {
        iziToast.warning({
            position: 'topRight',
            message: 'لطفا استان را انتخاب کنید'

        })
    } else if (selectElement.value === '') {
        iziToast.warning({
            position: 'topRight',
            message: 'لطفا شهر مورد نظر را انتخاب کنید'

        })

    } else {
        Swal.fire({
            title: "آیا از ثبت لینک مطمین هستید ؟",
            showDenyButton: true,
            confirmButtonText: "تایید",
            denyButtonText: `لغو`
        }).then(async (result) => {
            if (result.isConfirmed) {

                const obj = { ...osData[selectElement.value - 1] }
                obj[coursesWrapper.value] = dataInput.value

                const res1 = await fetch(`${BASEURL}/${osName}/${selectElement.value}`, {
                    method: 'PUT',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(obj)
                });

                if (res1.status < 300) {
                    const result = await res1.json();
                    osData[result.id - 1] = result;
                    iziToast.success({
                        position: 'topRight',
                        message: 'لینک با موفقیت ثبت شد :)'
                    })
                } else {
                    iziToast.error({
                        position: 'topRight',
                        message: 'لینک مورد نظر ثبت نشد :('
                    })
                }
            }
        });

    }
})

//////////////////////////////////////////////////////////////////////////////////////

const deleteCity = document.querySelector('#delete-city');
deleteCity.addEventListener('click', async () => {
    const cityOsDelete = document.querySelector('#city-os-delete');
    const citesDelete = document.querySelector('#cites-delete');

    if (cityOsDelete.value === '') {
        iziToast.warning({
            position: 'topRight',
            message: 'لطفا استان را انتخاب کنید'

        })
    } else if (citesDelete.value === '') {
        iziToast.warning({
            position: 'topRight',
            message: 'لطفا نام شهر مورد نظر را انتخاب کنید'

        })

    } else {
        Swal.fire({
            title: "آیا از حذف شهر مطمین هستید ؟",
            showDenyButton: true,
            confirmButtonText: "تایید",
            denyButtonText: `لغو`
        }).then(async (result) => {
            if (result.isConfirmed) {

                const res = await fetch(`${BASEURL}/${cityOsDelete.value}/${citesDelete.value}`, {
                    method: 'DELETE'
                });


                if (res.status < 300) {
                    cityOsDelete.value = ''
                    citesDelete.value = ''
                    iziToast.success({
                        position: 'topRight',
                        message: 'شهر مورد نظر حذف شد :)'
                    })
                } else {
                    iziToast.error({
                        position: 'topRight',
                        message: 'شهر مورد نظر حذف نشد :)'
                    })
                }
            }
        });

    }
});



/////////////////////////////////////////////////////////////////////
const deleteCourses = document.querySelector('#delete-courses');
deleteCourses.addEventListener('click', async () => {
    const deleteCoursesW = document.querySelector('.delete-coursesW');


    if (deleteCoursesW.value === '') {
        iziToast.warning({
            position: 'topRight',
            message: 'لطفا یک دوره برای حذف انتخاب کنید'

        })

    } else {
        Swal.fire({
            title: "آیا از حذف دوره مطمین هستید ؟",
            showDenyButton: true,
            confirmButtonText: "تایید",
            denyButtonText: `لغو`
        }).then(async (result) => {
            if (result.isConfirmed) {

                const res = await fetch(`${BASEURL}/data/${deleteCoursesW.value}`, { method: 'DELETE' });

                if (res.status < 300) {
                    const result = await res.json();
                    setCourses(result)
                    iziToast.success({
                        position: 'topRight',
                        message: 'دوره مورد نظر حذف شد :)'
                    })
                } else {
                    iziToast.error({
                        position: 'topRight',
                        message: 'دوره مورد نظر حذف نشد:('
                    })
                }

            }
        });


    }







})
