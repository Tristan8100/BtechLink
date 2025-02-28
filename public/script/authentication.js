//START OF TOGGLE FOR SHOW/HIDE PASSWORD
$(document).ready(function () {
    $(".toggle-password").click(function () {
        let input = $(this).siblings(".password-field"); 
        let icon = $(this).children("svg"); 

        if (input.attr("type") === "password") {
            input.attr("type", "text");
            icon.html(`
                <path stroke-linecap="round" stroke-linejoin="round"
                    d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
            `);
        } else {
            input.attr("type", "password");
            icon.html(`
                <path stroke-linecap="round" stroke-linejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                <path stroke-linecap="round" stroke-linejoin="round"
                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            `);
        }
    });
});
//END OF TOGGLE FOR SHOW/HIDE PASSWORD

//START OF OTP
$(document).ready(function () {
    $(".otp-input").on("input", function () {
        let currentInput = $(this);
        let nextInput = currentInput.next(".otp-input");
        
        if (currentInput.val().match(/[^0-9]/)) {
            currentInput.val(''); // Clear input if not a number
        }

        if (currentInput.val() !== "" && nextInput.length) {
            nextInput.focus();
        }
    });

    $(".otp-input").on("keydown", function (e) {
        let currentInput = $(this);
        let prevInput = currentInput.prev(".otp-input");

        if (e.key === "Backspace" && currentInput.val() === "" && prevInput.length) {
            prevInput.focus().val(""); // Move back and clear previous field
        }
    });  
});


//use this function to get all of the input or get the value of code
function getOTP() {
    let otp = "";
    $(".otp-input").each(function () {
        otp += $(this).val(); 
    });
    return otp;
}
//END OF OTP


//START OF TOAST
  $(document).ready(function () {
    let toast = $(".toast");
    $('.toast').hide();
    let timeout;

    function startFadeOut() {
      toast.show();
      timeout = setTimeout(function () {
        toast.fadeOut(1500); //slow fade in 1.5s
      }, 3000); // 3 seconds before fade out
    }

    //TRISTAN: REMINDER: ACCESS THE PARAMETER QUERY TO TOGGLE startFadeOut
    //startFadeOut();

    //if hover it will stop fading
    toast.hover(
      function () {
        clearTimeout(timeout); // stop fade out on hover
        toast.stop(true, true).fadeIn(200); //ensure it's fully visible
      },
      function () {
        startFadeOut(); // restart the fade-out timer when hover ends
      }
    );
  });
//END OF TOAST












