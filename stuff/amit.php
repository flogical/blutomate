
<?php

	
	$email = $_POST['email'];
	$name = $_POST['name'];
	$message = $_POST['message'];
	$object = $_POST['object'];


$from = $email ; 
//$to = 'blu.tomato.toronto@gmail.com'; 
$to = 'muyango3@gmail.com'; 
$subject = $object ;
$body = " From: $name\n E-Mail: $email\n Message:\n\n  $message";
$sent;

	if(validate($email)){
		if(mail($to, $subject, $body, $from)){
			$sent = true;
		}
		else{
			$sent = false;
		}
	}

// if (mail ($to, $subject, $body, $from)) { 
//     echo '<p>Your message has been sent!</p>';
// } 
// else { 
//     echo '<p>Something went wrong, go back and try again!</p>'; 
// }

function validate($email){
	$regex = ".*@.*"
	if (preg_match($regex, $regex))
	{
		return true;
	}
	else{
		return false;
	}

}

?>

