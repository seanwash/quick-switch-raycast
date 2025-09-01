# Quick Switch

Quick switch is a simple Raycast extension that allows you to switch between a configurable set of apps quickly.

![quick-switch-preview.png](assets/quick-switch-preview.png)

I often use keybinds like `hyper + c` to jump to specific applications, but I also like to rotate between different editors. This meant that I would have to update Raycast's settings or my Karabiner Elements config to change the keybinds. This extension allows me to quickly switch between editors without having to change keybinds every time my preferred editor changes.

## Installation & setup

* [Install the extension](https://developers.raycast.com/basics/contribute-to-an-extension)
  * Clone the repository
  * From that directory run `npm install` and `npm run dev`. The extension should automatically open
* Configure the apps you want to switch between in the extension settings via the extension preferences
* Configure the extension's keybind

## Usage

### Switching between apps

Using the extension will show you the list of apps that you've configured. You can select one of them to switch to it. The next time you use the keybind, the previously selected app will be at the top of the list. That's it!

### Configuring the extension

The extension can be configured via the extension preferences. The `cmd + shift + ,` shortcut can be used to open the preferences directly.

### Setting as the default application

This extension can also be used to change the default application for a configurable set of file extensions. [Duti](https://github.com/moretension/duti) is used behind the scenes and is required to be installed on your system. Once Duti is installed, `cmd + d` can be used to set the currently hovered app as the default application for the configured file extensions.


## Resources

* https://developers.raycast.com
* https://developers.raycast.com/basics/create-your-first-extension
* https://github.com/moretension/duti
