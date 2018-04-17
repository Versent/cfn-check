package main

import (
	"fmt"
	"os"

	kingpin "gopkg.in/alecthomas/kingpin.v2"
)

func main() {
	fmt.Println("vim-go")
	app := kingpin.New("cfn-check", "Opinionated CloudFormation checking tool")
	app.HelpFlag.Short('h')
	kingpin.MustParse(app.Parse(os.Args[1:]))
}
