#!/usr/bin/perl
use strict;
use warnings;
use CGI;
my $q = CGI->new;
my $sear = $q->param('search');
print $q->redirect("https://google.com/search?q=$sear&tbm=isch");