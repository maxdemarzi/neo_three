require 'rubygems'
require 'neography'
#require 'sinatra'
require 'sinatra/base'
require 'uri'
require 'gon-sinatra'

  def generate_text(length=8)
    chars = 'abcdefghjkmnpqrstuvwxyz'
    key = ''
    length.times { |i| key << chars[rand(chars.length)] }
    key
  end
  
  def create_graph
    neo = Neography::Rest.new
    graph_exists = neo.get_node_properties(1)
    return if graph_exists && graph_exists['name']
  
    names = 200.times.collect{|x| generate_text}
    commands = []
    names.each_index do |n|
      commands << [:create_node, {:name => names[n], 
                                  :position_x => rand(2000) - 1000,
                                  :position_y => rand(2000) - 1000,
                                  :position_z => rand(2000) - 1000,
                                  :rotation_x => rand(360) * (Math::PI / 180),
                                  :rotation_y => rand(360) * (Math::PI / 180)
                                 }]
    end

    names.each_index do |from| 
      commands << [:add_node_to_index, "nodes_index", "type", "User", "{#{from}}"]
      connected = []

      # create clustered relationships
      members = 20.times.collect{|x| x * 10 + (from % 5)}
      members.delete(from)
      rels = 2
      rels.times do |x|
        to = members[x]
        connected << to
        commands << [:create_relationship, "follows", "{#{from}}", "{#{to}}"]  unless to == from
      end    

      # create random relationships
      rels = 2
      rels.times do |x|
        to = rand(names.size)
        commands << [:create_relationship, "follows", "{#{from}}", "{#{to}}"] unless (to == from) || connected.include?(to)
      end

    end

    batch_result = neo.batch *commands
  end

class App < Sinatra::Base
  register Gon::Sinatra
  
  def nodes
    neo = Neography::Rest.new
    cypher_query =  " START node = node:nodes_index(type='User')"
    cypher_query << " RETURN ID(node), node"
    neo.execute_query(cypher_query)["data"].collect{|n| {"id" => n[0]}.merge(n[1]["data"])}
  end  
  
  def edges
    neo = Neography::Rest.new
    cypher_query =  " START source = node:nodes_index(type='User')"
    cypher_query << " MATCH source -[rel]-> target"
    cypher_query << " RETURN ID(rel), ID(source), ID(target)"
    neo.execute_query(cypher_query)["data"].collect{|n| {"id" => n[0], "source" => n[1], "target" => n[2]} }
  end
  
  get '/' do
    neo = Neography::Rest.new
    gon.nodes = nodes  
    gon.edges = edges
    erb :index
  end
end