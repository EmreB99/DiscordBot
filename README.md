# DiscordBot
A general purpose Disord bot.

<strong> Do not forget to setup the 'config.json' file inside 'src/' folder! </strong>

# Current feautres:



  * User registration
  * Mass message delete
  * Mass announcement mail sending: You can send announcements mails to all of your registered users.
  
    * How it works:
      - Define the id of the announcement channel inside the config file.
        + To get the id of the channel you must enable developer mode from Discord application. 
        + After enabling the developer mode when you right click to any channel now you will have an option as "Copy ID".
      - Each time a user sends a new message to the announcement channel bot will send an email to every registered user in the database.
      
      * It is advised to set up the roles for your announcement channel so that only the moderators can send messages to the announcement channel.
  * Extendable plugin(command) support
    - You can add new features / commands to the bot via adding new .js files to your commands folder.
    - During start up bot will load all the commands into the memory.
    - You can easily copy/paste than edit some of the simple command scripts such as <strong>!status</strong> to understand the basic principles of how commands works.
    
