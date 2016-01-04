/****************************************************************
 * Designer: Erhan YILMAZ										*
 * Application: Control application with Telegram bot api and	*
 * Raspberry Pi 												*
 * Date: 04-01-2016												*
 * Version: 1.0													*
 * Description:	This is NodeJS application to get/send			*
 * message over the telegram users by telegram bots and			*
 * according to message the application writes or 				*
 * reads soecified GPIO pins of RPI								*
 * *************************************************************/

  console.log('Aplication Started!');
 
// Telegram Bot API module
// https://www.npmjs.com/package/telegram-bot-api
var telegram = require('telegram-bot-api');
var api = new telegram({
	token: '158611125:AAG0vIH8F9xk36FF-fHdC2ivqL0YCpfqVaw',
	updates: {
		enabled: true,
		get_interval: 1000
	}
});
/////////////////////////////////////////////////////////

var gpio = require('rpi-gpio');
 
gpio.setup(36, gpio.DIR_IN);
gpio.setup(38, gpio.DIR_OUT);
gpio.setup(40, gpio.DIR_OUT);


// Global variables used in program
var chatId;
var chatName;

  
// When someone send message to bot this event runs to get message.
api.on('message', function(message)
{
	chatId = message.chat.id;			// To reply we need sender id
	chatName = message.chat.first_name;	// Sender first name
	var command="";
	var txt="";
	var commandType=false;
	
	// It'd be good to check received message type here
	// And react accordingly
	// We consider that only text messages can be received here
	if(message.chat.id == "82112412")
	{	
		message.text = message.text.toLowerCase();	// Firs convert message to lower case.
	//	Check the message to get command
		if(message.text.indexOf("gpio38high")>-1)
		{
			txt='High written to pin38';
			gpio.write(38, true, function(err) {
					if (err) throw err;
					console.log('High written to pin38');
				});
			commandType=true;
		}	
		else if(message.text.indexOf("gpio38low")>-1)
		{
			txt='Low written to pin38';
			gpio.write(38, false, function(err) {
					if (err) throw err;
					console.log('Low written to pin38');
				});
				commandType=true;
		}
		else if(message.text.indexOf("gpio40high")>-1)
		{
			txt='High written to pin40';
			gpio.write(40, true, function(err) {
					if (err) throw err;
					console.log('High written to pin40');
				});
				commandType=true;
		}
		else if(message.text.indexOf("gpio40low")>-1)
		{
			txt='Low written to pin40';
			gpio.write(40, false, function(err) {
					if (err) throw err;
					console.log('Low written to pin40');
				});
				commandType=true;
		}
		else if(message.text.indexOf("gpio36read")>-1)
		{
			gpio.read(36, function(err, value) {
				console.log('The GPIO36 pin value is ' + value);
				txt='The GPIO36 pin value is ' + value;
				api.sendMessage({
					chat_id: chatId,
					text: chatName+":"+txt
					}, function(err, message)
					{
						if(err)console.log(err);
						//console.log(message);		// More info about message packet
						console.log(chatName+":"+txt);
					});
				});
		}
		else	// Unknown message
		{
			txt="Unknown Command";
			commandType=true;
		}
//////////////////////////////////////////////////

		if(commandType)
		{
			api.sendMessage({
				chat_id: chatId,
				text: chatName+":"+txt
			}, function(err, message)
			{
				if(err)console.log(err);
				//console.log(message);		// More info about message packet
				console.log(chatName+":"+txt);
			});
		}
	}
	else
	{
		api.sendMessage({
				chat_id: chatId,
				text: chatName+":Please get lost!"
			}, function(err, message)
			{
				if(err)console.log(err);
				//console.log(message);		// More info about message packet
				console.log(chatName+":Tried to acces to system!");
			});
	}
});
