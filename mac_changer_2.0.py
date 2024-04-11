#!/usr/bin/env python

#TODA LA INFO DEL SCRIPT EN MCAddres INFO.py

import subprocess
import argparse  #INPUT LIMITADO A CIERTAS RESPUESTAS
import re
def getArguments():
    parser = argparse.ArgumentParser()  # Class
    parser.add_argument("-i", "--interface", dest="interface", help="Interface to change its MAC Address")
    parser.add_argument("-m", "--MAC", dest="MAC",help="New MAC Address")
    (options,arguments)=parser.parse_args()  #Lee las options del parser
    if not options.interface:
            parser.error("[-] Especifica una interfaz usa --help para mas info")
    elif not options.MAC:
            parser.error("[-] Especifica un nuevo MAC usa --help para mas info")
    return options
def changeMac(interface,MAC):#Puedo usar el nombre que quieras
    print("[+] Cambiando MAC Address de... " + interface)
    subprocess.call(["ifconfig", interface, "down"])
    subprocess.call(["ifconfig", interface, "hw", "ether", MAC])
    subprocess.call(["ifconfig", interface, "up"])
    subprocess.call(["ifconfig", interface])
    print("Su nueva dirección de " + interface + " se ha cambiado a: " + MAC)

def getCurrentMac(interface):
    ifconfig_Result = subprocess.check_output(["ifconfig", interface])
    direccion_MAC=r"\w\w:\w\w:\w\w:\w\w:\w\w:\w\w"
    mac_results_search = re.search(direccion_MAC, str(ifconfig_Result))
    if mac_results_search:
        return mac_results_search.group(0)
    else:
        print("[-] no se puede lanzar el programa")

options = getArguments()

currentMac = getCurrentMac(options.interface)

print(str(currentMac))

changeMac(options.interface, options.MAC)

currentMac = getCurrentMac(options.interface)
if currentMac == options.MAC:
    print("[+] La dirección MAC se ha cambiado correctamente a: "+str(currentMac))
else:
    print("La dirrecion MAC no ha cambiado")