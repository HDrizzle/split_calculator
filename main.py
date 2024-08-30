#!/usr/bin/env python
# -*- coding: utf-8 -*-
#
#  main.py
#  
#  Copyright 2022 Hadrian Ward <hadrian.f.ward@gmail.com>
#  
#  This program is free software; you can redistribute it and/or modify
#  it under the terms of the GNU General Public License as published by
#  the Free Software Foundation; either version 2 of the License, or
#  (at your option) any later version.
#  
#  This program is distributed in the hope that it will be useful,
#  but WITHOUT ANY WARRANTY; without even the implied warranty of
#  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#  GNU General Public License for more details.
#  
#  You should have received a copy of the GNU General Public License
#  along with this program; if not, write to the Free Software
#  Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
#  MA 02110-1301, USA.
#  
#  


import sys, os

# custom lib, see https://stackoverflow.com/questions/4081330/how-do-i-modify-the-system-path-variable-in-python-script/41171179#41171179
sys.path.append(os.path.join(os.path.expanduser('~'), 'python_lib'))
import webserver, extras


base_dir = os.getcwd()
http_dir = os.path.join(base_dir, 'http')
port = extras.port_assignments['split-calculator']


def main():
	# init
	http_handler = webserver.HTTP_handler(root_dir=http_dir, log_file='webserver_log.txt')
	http_handler.special_get['/stats/stats.json'] = http_handler.callback_get_stats
	server = webserver.Server(port=port, request_handler=http_handler.parse_request, ip=extras.ip)# ------------------------------- PUT RPi IP HERE
	# mainloop
	print('Server loop running')
	server.loop()
	print('Done')
	return 0

if __name__ == '__main__':
	sys.exit(main())
