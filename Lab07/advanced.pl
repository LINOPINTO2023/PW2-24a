#!/usr/bin/perl
use strict;
use warnings;
use CGI;
my $q = CGI->new;
my $link = "https://www.google.com/search?";
my $search_all = $q->param("all");
my $search_exact = $q->param("exact");
my $search_none = $q->param("none");
if ($search_all) {
    $link = $link."as_q=$search_all&";
}
if ($search_exact) {
    $link = $link."as_epq=\"$search_exact\"&";
}
if ($search_none) {
    $link = $link."as_eq=$search_none&";
}
print $q->redirect($link);