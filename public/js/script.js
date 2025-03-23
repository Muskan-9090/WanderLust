(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })()

let taxToggles = document.querySelectorAll(".toggle-btn");
taxToggles.forEach(taxToggle =>{
  taxToggle.addEventListener("click",()=>{
    let taxInfo = document.getElementsByClassName("tax-info");
      for(let info of taxInfo){
          if(info.style.display === "inline"){
            info.style.display = "none";
          }
          else{
            info.style.display = "inline";
          }
      }
  })
})

let filters = document.querySelectorAll(".filter");
filters.forEach(filter=>{
  filter.addEventListener("click",function(){
    let category = this.querySelector("p").textContent;
    window.location.href = `/listings?q=${category}`;
  })
});