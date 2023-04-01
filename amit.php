
<?php
mb_internal_encoding("UTF-8");

function validate($email){
	$regex = ".*@.*";
	echo 'we in validate';
	echo $regex;
	echo $email;
	echo preg_match($regex, $email);
	if (preg_match($regex, $email))
	{ echo 'halleluya m correct';
		return true;
	}
	else{
		echo 'not really no';
		return false;
	}

}

	//should put this in an if post is submit? and also add a validate for empty
	$email = $_POST['email'];
	$name = $_POST['name'];
	$message = $_POST['message'];
	$object = $_POST['object'];


$from = $email ; 
//$to = 'blu.tomato.toronto@gmail.com'; 
$to = 'muyango3@gmail.com'; 
$subject = $object ;
$body = " From: $name\n E-Mail: $email\n Message:\n\n  $message";

echo 'here we go!';
echo $email ;

	if(validate($email)){
		echo 'grrr m in here now';
		if(mail($to, $subject, $body, $from)){
			echo 'Your message has been sent!';
		}
		else{
			echo 'Something went wrong, go back and try again!'; 
		}
	}
	else {
		echo 'The email was not a valid email, Please try again';
	}

// if (mail ($to, $subject, $body, $from)) { 
//     echo 'Your message has been sent!';
// } 
// else { 
//     echo 'Something went wrong, go back and try again!'; 
// }



?>

