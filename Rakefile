namespace :javascript do

	desc "Mash everyting togheter"
	task :mash do
		sh "cat scripts/lib/jquery/jquery.1.8.2.min.js > scripts/markd-editor.min.js"
		sh "java -jar /Applications/yuicompressor.jar scripts/lib/jquerypp/jquerypp.custom.js >> scripts/markd-editor.min.js"
		sh "java -jar /Applications/yuicompressor.jar scripts/lib/marked/lib/marked.js >> scripts/markd-editor.min.js"
		sh "java -jar /Applications/yuicompressor.jar scripts/lib/mousetrap/mousetrap.js >> scripts/markd-editor.min.js"
		sh "java -jar /Applications/yuicompressor.jar scripts/jquery-markd.js >> scripts/markd-editor.min.js"
	end

	desc "Minify"
	task :minify do
		sh "java -jar /Applications/yuicompressor.jar scripts/jquery-markd.js > scripts/jquery-markd.min.js"
	end

end
