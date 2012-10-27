namespace :javascript do

	desc "Mash everyting togheter"
	task :mash do
		sh "cat scripts/lib/jquery/jquery.1.8.2.min.js > src/markd-editor.min.js"
		sh "java -jar /Applications/yuicompressor.jar lib/jquerypp/jquerypp.custom.js >> src/markd-editor.min.js"
		sh "java -jar /Applications/yuicompressor.jar lib/marked/lib/marked.js >> src/markd-editor.min.js"
		sh "java -jar /Applications/yuicompressor.jar lib/mousetrap/mousetrap.js >> src/markd-editor.min.js"
		sh "java -jar /Applications/yuicompressor.jar src/jquery-markd.js >> src/markd-editor.min.js"
	end

	desc "Minify"
	task :minify do
		sh "java -jar /Applications/yuicompressor.jar src/jquery-markd.js > src/jquery-markd.min.js"
	end

end
