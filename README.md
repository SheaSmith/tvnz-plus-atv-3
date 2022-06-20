# TVNZ+ for Apple TV 3
This is an unofficial client for TVNZ+ for the 3rd generation Apple TV (yes the one you couldn't run apps on).

## Installation instructions
These will eventually be more complete, but this will do for now.
1. Jailbreak your Apple TV
2. Enable the Add Site button.
3. Add https://tvnz-appletv.shea.nz/bag.plist
4. TVNZ+ will now be in your home screen.

## Building it yourself
If you'd rather self host it or want to develop for it, you will need to compile your JavaScript by running `npm run build`, then you will need to put the files in the `files` folder into the root of your web server. Then, make a new folder called `js` in the root of the webserver and copy the contents of the `dist` folder to it. Now add a site for your webserver (don't forget the bag.plist) to your Apple TV.
