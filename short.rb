p ARGV
text = ARGV.length > 0 ? ARGV[0] : 'Communication'
text_length = text.length

if text_length >= 10
  text_short = "#{text[0]}#{text_length-2}#{text[-1]}".downcase
end

puts "#{text} => #{text_short}"
