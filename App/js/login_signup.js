$('.form').find('input, textarea').on('keyup blur focus', function (e) {
  
  var $this = $(this),
      label = $this.prev('label');

      if (e.type === 'keyup') {
            if ($this.val() === '') {
          label.removeClass('active highlight');
        } else {
          label.addClass('active highlight');
        }
    } else if (e.type === 'blur') {
        if( $this.val() === '' ) {
            label.removeClass('active highlight'); 
            } else {
            label.removeClass('highlight');   
            }   
    } else if (e.type === 'focus') {
      
      if( $this.val() === '' ) {
            label.removeClass('highlight'); 
            } 
      else if( $this.val() !== '' ) {
            label.addClass('highlight');
            }
    }

});

$('.tab a').on('click', function (e) {
  
  e.preventDefault();
  
  $(this).parent().addClass('active');
  $(this).parent().siblings().removeClass('active');
  
  target = $(this).attr('href');

  $('.tab-content > div').not(target).hide();
  
  $(target).fadeIn(600);
  
});

var formSignIn = document.getElementById('fr_li');

formSignIn.addEventListener('submit', function(event) {
  var headers = {
    "Content-Type": "application/json",                                                                                                
    "Access-Control-Origin": "*"
  }

  var data = {
      'email' : document.getElementById("em_li").value,
      'pass': document.getElementById("pw_li").value
  }
  var url = '/auth/signin/';

  var fetchOptions = {
    method: 'POST',
    headers,
    body: JSON.stringify(data)
  };
  
  fetch(url, fetchOptions)
    .then((res) => {
      // console.log(res);
      switch (res.status){
        case 200:
          window.location.href = "/";
          break;
        case 401:
          alert('Invalid User or Wrong password');
          break;
      }
    })
  

  event.preventDefault();
});

var formSignUp = document.getElementById('fr_signup');

formSignUp.addEventListener('submit', function(event) {
  var headers = {
    "Content-Type": "application/json",                                                                                                
    "Access-Control-Origin": "*"
  }

  const displayName = document.getElementById("txt_fn").value + " " + document.getElementById("txt_ln").value;
  var data = {
      'firstName': document.getElementById("txt_fn").value,
      'lastName': document.getElementById("txt_ln").value,
      'displayName': displayName,
      'email' : document.getElementById("txt_em").value,
      'password': document.getElementById("txt_pw").value
  }
  var url = '/auth/signup/';

  var fetchOptions = {
    method: 'POST',
    headers,
    body: JSON.stringify(data)
  };
  
  fetch(url, fetchOptions)
    .then((res) => {
      // console.log(res);
      switch (res.status){
        case 200:
          window.location.href = "/";
          break;
        case 409:
          alert('User already exist!!!');
          break;
      }
    })
  

  event.preventDefault();
});